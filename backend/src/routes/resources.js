const express = require('express');
const { CourseStatus, OrderStatus, PaymentStatus, Role } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const { buildVideoUrl, removeUploadedFile, uploadVideo } = require('../middleware/upload');
const { mapFrontendResource, pickFrontendCourseInclude } = require('../utils/frontendMapper');
const { slugify } = require('../utils/slugify');
const { normalizeString } = require('../utils/validation');

const router = express.Router();

async function createUniqueCourseSlug(title) {
  const baseSlug = slugify(title) || `resource-${Date.now()}`;
  const exactMatch = await prisma.course.findUnique({ where: { slug: baseSlug } });

  if (!exactMatch) {
    return baseSlug;
  }

  return `${baseSlug}-${Date.now()}`;
}

async function createUniqueCategorySlug(name) {
  const baseSlug = slugify(name) || `category-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;

  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

async function resolveCategory({ categoryId, categoryName }) {
  if (categoryId) {
    return prisma.category.findUnique({ where: { id: categoryId } });
  }

  if (!categoryName) {
    return null;
  }

  const existingCategories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true
    }
  });

  const normalizedName = categoryName.toLowerCase();
  const existingCategory = existingCategories.find(
    (item) => item.name.trim().toLowerCase() === normalizedName
  );

  if (existingCategory) {
    return existingCategory;
  }

  return prisma.category.create({
    data: {
      name: categoryName,
      slug: await createUniqueCategorySlug(categoryName)
    }
  });
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return ['true', '1', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

router.get('/', asyncHandler(async (_req, res) => {
  const resources = await prisma.course.findMany({
    where: { status: CourseStatus.APPROVED },
    include: pickFrontendCourseInclude(),
    orderBy: [
      { publishedAt: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  res.json(resources.map(mapFrontendResource));
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const resource = await prisma.course.findFirst({
    where: {
      slug: req.params.slug,
      status: CourseStatus.APPROVED
    },
    include: pickFrontendCourseInclude()
  });

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  return res.json(mapFrontendResource(resource));
}));

router.post(
  '/',
  authenticate,
  requireRole(Role.INSTRUCTOR),
  uploadVideo.single('video'),
  asyncHandler(async (req, res) => {
    if (!req.user.instructorProfile) {
      await removeUploadedFile(req.file);
      return res.status(403).json({ error: 'Creator profile is required before publishing' });
    }

    const {
      categoryId,
      categoryName,
      title,
      shortDescription,
      description,
      price,
      thumbnailUrl,
      level,
      language,
      sectionTitle,
      lessonTitle,
      durationSeconds,
      isPreview
    } = req.body;

    const normalizedCategoryId = normalizeString(categoryId, { field: 'categoryId' });
    const normalizedCategoryName = normalizeString(categoryName, {
      field: 'categoryName',
      min: 2,
      max: 60
    });

    if ((!normalizedCategoryId && !normalizedCategoryName) || !title || !description || price === undefined) {
      await removeUploadedFile(req.file);
      return res.status(400).json({ error: 'categoryId or categoryName, title, description, and price are required' });
    }

    const category = await resolveCategory({
      categoryId: normalizedCategoryId,
      categoryName: normalizedCategoryName
    });

    if (!category) {
      await removeUploadedFile(req.file);
      return res.status(400).json({ error: 'Invalid category' });
    }

    const normalizedPrice = Number(price);
    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      await removeUploadedFile(req.file);
      return res.status(400).json({ error: 'price must be a valid non-negative number' });
    }

    const normalizedTitle = String(title).trim();
    const normalizedShortDescription = shortDescription ? String(shortDescription).trim() : null;
    const normalizedDescription = String(description).trim();
    const normalizedThumbnailUrl = thumbnailUrl ? String(thumbnailUrl).trim() : null;
    const normalizedLevel = level ? String(level).trim() : 'Beginner';
    const normalizedLanguage = language ? String(language).trim() : 'English';
    const hasVideo = Boolean(req.file);
    const normalizedDurationSeconds = Number(durationSeconds || 0);
    const storedVideoUrl = buildVideoUrl(req.file);
    const previewEnabled = hasVideo && parseBoolean(isPreview, normalizedPrice === 0);

    try {
      const resource = await prisma.course.create({
        data: {
          instructorId: req.user.id,
          categoryId: category.id,
          title: normalizedTitle,
          slug: await createUniqueCourseSlug(normalizedTitle),
          shortDescription: normalizedShortDescription,
          description: normalizedDescription,
          price: normalizedPrice,
          thumbnailUrl: normalizedThumbnailUrl,
          introVideoUrl: previewEnabled ? storedVideoUrl : null,
          level: normalizedLevel,
          language: normalizedLanguage,
          status: CourseStatus.APPROVED,
          publishedAt: new Date(),
          sections: hasVideo
            ? {
                create: [
                  {
                    title: sectionTitle ? String(sectionTitle).trim() : 'Course content',
                    sortOrder: 1,
                    lessons: {
                      create: [
                        {
                          title: lessonTitle ? String(lessonTitle).trim() : normalizedTitle,
                          videoProvider: 'UPLOAD',
                          videoUrl: storedVideoUrl,
                          thumbnailUrl: normalizedThumbnailUrl,
                          durationSeconds: Number.isFinite(normalizedDurationSeconds) && normalizedDurationSeconds > 0
                            ? Math.round(normalizedDurationSeconds)
                            : 0,
                          isPreview: previewEnabled,
                          sortOrder: 1
                        }
                      ]
                    }
                  }
                ]
              }
            : undefined
        },
        include: pickFrontendCourseInclude()
      });

      return res.status(201).json(mapFrontendResource(resource));
    } catch (error) {
      await removeUploadedFile(req.file);
      throw error;
    }
  })
);

router.post(
  '/:resourceId/access',
  authenticate,
  requireRole(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN),
  asyncHandler(async (req, res) => {
    const resource = await prisma.course.findFirst({
      where: {
        id: req.params.resourceId,
        status: CourseStatus.APPROVED
      },
      include: pickFrontendCourseInclude()
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: req.user.id,
          courseId: resource.id
        }
      }
    });

    if (existingEnrollment) {
      return res.json({
        alreadyOwned: true,
        enrollmentId: existingEnrollment.id,
        resource: mapFrontendResource(resource)
      });
    }

    const purchase = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount: resource.price,
          status: OrderStatus.PAID,
          items: {
            create: [{ courseId: resource.id, price: resource.price }]
          }
        }
      });

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider: req.body.provider || 'EDUBRIDGE',
          paymentMethod: req.body.paymentMethod || (Number(resource.price) === 0 ? 'free' : 'demo'),
          providerTransactionId: `edubridge-${Date.now()}`,
          amount: resource.price,
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          rawResponseJson: JSON.stringify({ simulated: true })
        }
      });

      const enrollment = await tx.enrollment.create({
        data: {
          userId: req.user.id,
          courseId: resource.id,
          orderId: order.id,
          paymentId: payment.id
        }
      });

      return { order, payment, enrollment };
    });

    const refreshedResource = await prisma.course.findUnique({
      where: { id: resource.id },
      include: pickFrontendCourseInclude()
    });

    return res.status(201).json({
      alreadyOwned: false,
      ...purchase,
      resource: mapFrontendResource(refreshedResource)
    });
  })
);

module.exports = router;

const express = require('express');
const { CourseStatus, Role, VerificationStatus, OrderStatus, PaymentStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, requireRole } = require('../middleware/auth');
const { pickCourseInclude } = require('../utils/courseMapper');
const { mapCourseToResource } = require('../utils/resourceMapper');
const { slugify } = require('../utils/slugify');
const {
  normalizeBoolean,
  normalizeNumber,
  normalizePagination,
  normalizeString
} = require('../utils/validation');
const { badRequest } = require('../utils/http');

const router = express.Router();

function buildResourceWhere(query) {
  const search = normalizeString(query.q, { field: 'q', max: 120 });
  const category = normalizeString(query.category, { field: 'category', max: 80 });
  const creator = normalizeString(query.creator, { field: 'creator', max: 120 });
  const level = normalizeString(query.level, { field: 'level', max: 40 });
  const language = normalizeString(query.language, { field: 'language', max: 40 });
  const isFree = query.isFree === undefined ? undefined : normalizeBoolean(query.isFree);
  const priceMin = normalizeNumber(query.priceMin, { field: 'priceMin', min: 0 });
  const priceMax = normalizeNumber(query.priceMax, { field: 'priceMax', min: 0 });

  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
    throw badRequest('priceMin cannot be greater than priceMax');
  }

  return {
    status: CourseStatus.APPROVED,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { shortDescription: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {}),
    ...(category
      ? {
          category: {
            is: {
              OR: [
                { id: category },
                { slug: { equals: category, mode: 'insensitive' } },
                { name: { equals: category, mode: 'insensitive' } }
              ]
            }
          }
        }
      : {}),
    ...(creator
      ? {
          instructor: {
            is: {
              fullName: { contains: creator, mode: 'insensitive' }
            }
          }
        }
      : {}),
    ...(level ? { level: { equals: level, mode: 'insensitive' } } : {}),
    ...(language ? { language: { equals: language, mode: 'insensitive' } } : {}),
    ...(isFree === true ? { price: 0 } : {}),
    ...(isFree === false ? { price: { gt: 0 } } : {}),
    ...(priceMin !== undefined || priceMax !== undefined
      ? {
          price: {
            ...(priceMin !== undefined ? { gte: priceMin } : {}),
            ...(priceMax !== undefined ? { lte: priceMax } : {})
          }
        }
      : {})
  };
}

function buildResourceOrderBy(sort) {
  switch ((sort || '').toLowerCase()) {
    case 'price_asc':
      return [{ price: 'asc' }, { createdAt: 'desc' }];
    case 'price_desc':
      return [{ price: 'desc' }, { createdAt: 'desc' }];
    case 'title':
      return [{ title: 'asc' }];
    case 'popular':
      return [{ enrollments: { _count: 'desc' } }, { publishedAt: 'desc' }];
    case 'top_rated':
      return [{ reviews: { _count: 'desc' } }, { publishedAt: 'desc' }];
    case 'latest':
    default:
      return [{ publishedAt: 'desc' }, { createdAt: 'desc' }];
  }
}

function normalizeResourcePayload(body) {
  return {
    categoryId: normalizeString(body.categoryId, { field: 'categoryId', required: true }),
    title: normalizeString(body.title, { field: 'title', required: true, min: 3, max: 160 }),
    description: normalizeString(body.description, { field: 'description', required: true, min: 20, max: 5000 }),
    shortDescription: normalizeString(body.shortDescription, { field: 'shortDescription', max: 240 }) || null,
    price: normalizeNumber(body.price, { field: 'price', required: true, min: 0 }),
    thumbnailUrl: normalizeString(body.thumbnailUrl, { field: 'thumbnailUrl', max: 2000 }) || null,
    language: normalizeString(body.language, { field: 'language', max: 60 }) || null,
    level: normalizeString(body.level, { field: 'level', max: 60 }) || null
  };
}

router.get('/', asyncHandler(async (req, res) => {
  const { page, limit, skip } = normalizePagination(req.query, { page: 1, limit: 24 });
  const where = buildResourceWhere(req.query);
  const orderBy = buildResourceOrderBy(req.query.sort);

  const [resources, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: pickCourseInclude(),
      orderBy,
      skip,
      take: limit
    }),
    prisma.course.count({ where })
  ]);

  res.set('X-Total-Count', String(total));
  res.set('X-Page', String(page));
  res.set('X-Limit', String(limit));
  res.json(resources.map(mapCourseToResource));
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const resource = await prisma.course.findFirst({
    where: {
      status: CourseStatus.APPROVED,
      OR: [{ slug: req.params.slug }, { id: req.params.slug }]
    },
    include: pickCourseInclude()
  });

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' });
  }

  return res.json(mapCourseToResource(resource));
}));

router.post('/', authenticate, requireRole(Role.INSTRUCTOR), asyncHandler(async (req, res) => {
  if (!req.user.instructorProfile || req.user.instructorProfile.verificationStatus !== VerificationStatus.APPROVED) {
    return res.status(403).json({ error: 'Creator profile is not approved yet' });
  }

  const payload = normalizeResourcePayload(req.body);

  const category = await prisma.category.findUnique({ where: { id: payload.categoryId } });
  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const baseSlug = slugify(payload.title);
  const slugCount = await prisma.course.count({ where: { slug: { startsWith: baseSlug } } });

  const resource = await prisma.course.create({
    data: {
      instructorId: req.user.id,
      categoryId: payload.categoryId,
      title: payload.title,
      slug: slugCount ? `${baseSlug}-${slugCount + 1}` : baseSlug,
      description: payload.description,
      shortDescription: payload.shortDescription,
      price: payload.price,
      thumbnailUrl: payload.thumbnailUrl,
      language: payload.language,
      level: payload.level,
      status: CourseStatus.DRAFT
    },
    include: pickCourseInclude()
  });

  res.status(201).json(mapCourseToResource(resource));
}));

router.post('/:resourceId/access', authenticate, asyncHandler(async (req, res) => {
  const resource = await prisma.course.findFirst({
    where: {
      status: CourseStatus.APPROVED,
      OR: [{ id: req.params.resourceId }, { slug: req.params.resourceId }]
    }
  });

  if (!resource) {
    return res.status(404).json({ error: 'Approved resource not found' });
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId: resource.id
      }
    }
  });

  if (existing) {
    return res.status(409).json({ error: 'Resource already added to your library' });
  }

  const provider = normalizeString(req.body.provider, { field: 'provider', max: 80 }) || 'EDUBRIDGE';
  const paymentMethod = normalizeString(req.body.paymentMethod, { field: 'paymentMethod', max: 80 }) || (resource.price === 0 ? 'free' : 'demo');

  const result = await prisma.$transaction(async (tx) => {
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
        provider,
        paymentMethod,
        providerTransactionId: `resource-${resource.id}-${Date.now()}`,
        amount: resource.price,
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        rawResponseJson: JSON.stringify({
          simulated: true,
          resourceId: resource.id,
          userId: req.user.id
        })
      }
    });

    const access = await tx.enrollment.create({
      data: {
        userId: req.user.id,
        courseId: resource.id,
        orderId: order.id,
        paymentId: payment.id
      }
    });

    return { order, payment, access };
  });

  res.status(201).json({
    message: 'Resource access granted',
    resourceId: resource.id,
    ...result
  });
}));

module.exports = router;

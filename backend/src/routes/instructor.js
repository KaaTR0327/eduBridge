const express = require('express');
const { Role, VerificationStatus, CourseStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { requireRole } = require('../middleware/auth');
const {
  buildImageUrl,
  buildVideoUrl,
  removeStoredUploadByUrl,
  removeUploadedFile,
  removeUploadedFiles,
  uploadCourseAssets,
  uploadVideo
} = require('../middleware/upload');
const { slugify } = require('../utils/slugify');
const { pickCourseInclude, mapCourse } = require('../utils/courseMapper');
const { serializeUser } = require('../utils/serialize');
const { normalizeNumber, normalizeString } = require('../utils/validation');

const router = express.Router();

router.use(requireRole(Role.INSTRUCTOR));

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return ['true', '1', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function collectCourseUploadUrls(course) {
  return Array.from(
    new Set([
      course.thumbnailUrl,
      course.introVideoUrl,
      ...course.sections.flatMap((section) => section.lessons.map((lesson) => lesson.videoUrl)),
      ...course.sections.flatMap((section) => section.lessons.map((lesson) => lesson.thumbnailUrl))
    ].filter(Boolean))
  );
}

router.post('/apply', asyncHandler(async (req, res) => {
  const bio = normalizeString(req.body.bio, { field: 'bio', max: 1000 }) || null;
  const expertise = normalizeString(req.body.expertise, { field: 'expertise', max: 200 }) || null;
  const profile = await prisma.instructorProfile.upsert({
    where: { userId: req.user.id },
    update: {
      bio,
      expertise,
      verificationStatus: VerificationStatus.PENDING,
      rejectedReason: null
    },
    create: {
      userId: req.user.id,
      bio,
      expertise,
      verificationStatus: VerificationStatus.PENDING
    }
  });

  res.json(profile);
}));

router.get('/dashboard', asyncHandler(async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { instructorId: req.user.id },
    include: pickCourseInclude(),
    orderBy: { createdAt: 'desc' }
  });

  const payments = await prisma.payment.findMany({
    where: {
      status: 'PAID',
      order: {
        items: {
          some: {
            course: {
              instructorId: req.user.id
            }
          }
        }
      }
    }
  });

  res.json({
    instructor: serializeUser(req.user),
    metrics: {
      totalCourses: courses.length,
      approvedCourses: courses.filter((course) => course.status === CourseStatus.APPROVED).length,
      pendingCourses: courses.filter((course) => course.status === CourseStatus.PENDING_REVIEW).length,
      totalStudents: courses.reduce((sum, course) => sum + (course._count?.enrollments || 0), 0),
      totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0)
    },
    courses: courses.map(mapCourse)
  });
}));

router.post('/courses', asyncHandler(async (req, res) => {
  if (!req.user.instructorProfile || req.user.instructorProfile.verificationStatus !== VerificationStatus.APPROVED) {
    return res.status(403).json({ error: 'Instructor is not approved yet' });
  }

  const categoryId = normalizeString(req.body.categoryId, { field: 'categoryId', required: true });
  const title = normalizeString(req.body.title, { field: 'title', required: true, min: 3, max: 160 });
  const description = normalizeString(req.body.description, { field: 'description', required: true, min: 20, max: 5000 });
  const shortDescription = normalizeString(req.body.shortDescription, { field: 'shortDescription', max: 240 }) || null;
  const price = normalizeNumber(req.body.price, { field: 'price', required: true, min: 0 });
  const thumbnailUrl = normalizeString(req.body.thumbnailUrl, { field: 'thumbnailUrl', max: 2000 }) || null;
  const level = normalizeString(req.body.level, { field: 'level', max: 60 }) || null;
  const language = normalizeString(req.body.language, { field: 'language', max: 60 }) || null;

  const course = await prisma.course.create({
    data: {
      instructorId: req.user.id,
      categoryId,
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      description,
      shortDescription,
      price,
      thumbnailUrl,
      level,
      language,
      status: CourseStatus.DRAFT
    },
    include: pickCourseInclude()
  });

  res.status(201).json(mapCourse(course));
}));

router.put('/courses/:courseId', uploadCourseAssets.fields([{ name: 'thumbnail', maxCount: 1 }]), asyncHandler(async (req, res) => {
  const existing = await prisma.course.findFirst({
    where: {
      id: req.params.courseId,
      instructorId: req.user.id
    },
    include: {
      sections: {
        include: {
          lessons: true
        }
      }
    }
  });

  if (!existing) {
    await removeUploadedFiles(req.files);
    return res.status(404).json({ error: 'Course not found' });
  }

  const thumbnailFile = req.files?.thumbnail?.[0] || null;
  const nextTitle = req.body.title
    ? normalizeString(req.body.title, { field: 'title', min: 3, max: 160 })
    : existing.title;
  const nextThumbnailUrl = thumbnailFile
    ? buildImageUrl(thumbnailFile)
    : req.body.thumbnailUrl !== undefined
      ? (normalizeString(req.body.thumbnailUrl, { field: 'thumbnailUrl', max: 2000 }) || null)
      : existing.thumbnailUrl;

  try {
    const updated = await prisma.course.update({
      where: { id: existing.id },
      data: {
        categoryId: req.body.categoryId || existing.categoryId,
        title: nextTitle,
        slug: req.body.title ? `${slugify(nextTitle)}-${existing.id.slice(-6)}` : existing.slug,
        description: req.body.description
          ? normalizeString(req.body.description, { field: 'description', min: 20, max: 5000 })
          : existing.description,
        shortDescription: req.body.shortDescription !== undefined
          ? (normalizeString(req.body.shortDescription, { field: 'shortDescription', max: 240 }) || null)
          : existing.shortDescription,
        thumbnailUrl: nextThumbnailUrl,
        introVideoUrl: req.body.introVideoUrl !== undefined
          ? (normalizeString(req.body.introVideoUrl, { field: 'introVideoUrl', max: 2000 }) || null)
          : existing.introVideoUrl,
        level: req.body.level !== undefined
          ? (normalizeString(req.body.level, { field: 'level', max: 60 }) || null)
          : existing.level,
        language: req.body.language !== undefined
          ? (normalizeString(req.body.language, { field: 'language', max: 60 }) || null)
          : existing.language,
        status: CourseStatus.PENDING_REVIEW,
        publishedAt: null,
        rejectedReason: null
      },
      include: pickCourseInclude()
    });

    if (thumbnailFile && existing.thumbnailUrl && existing.thumbnailUrl !== nextThumbnailUrl) {
      await removeStoredUploadByUrl(existing.thumbnailUrl);
    }

    res.json(mapCourse(updated));
  } catch (error) {
    await removeUploadedFiles(req.files);
    throw error;
  }
}));

router.post('/courses/:courseId/sections', asyncHandler(async (req, res) => {
  const course = await prisma.course.findFirst({
    where: {
      id: req.params.courseId,
      instructorId: req.user.id
    },
    include: { sections: true }
  });

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const section = await prisma.courseSection.create({
    data: {
      courseId: course.id,
      title: normalizeString(req.body.title, { field: 'title', required: true, min: 2, max: 160 }),
      sortOrder: normalizeNumber(req.body.sortOrder, { field: 'sortOrder', min: 1, integer: true }) || course.sections.length + 1
    }
  });

  res.status(201).json(section);
}));

router.delete('/courses/:courseId', asyncHandler(async (req, res) => {
  const course = await prisma.course.findFirst({
    where: {
      id: req.params.courseId,
      instructorId: req.user.id
    },
    include: {
      sections: {
        include: {
          lessons: {
            select: {
              id: true,
              videoUrl: true,
              thumbnailUrl: true
            }
          }
        }
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true,
          orderItems: true
        }
      }
    }
  });

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  if (course._count.enrollments > 0 || course._count.orderItems > 0 || course._count.reviews > 0) {
    return res.status(409).json({
      error: 'This course already has student activity or purchase history, so it cannot be deleted.'
    });
  }

  const lessonIds = course.sections.flatMap((section) => section.lessons.map((lesson) => lesson.id));
  const uploadUrls = collectCourseUploadUrls(course);

  await prisma.$transaction(async (tx) => {
    if (lessonIds.length > 0) {
      await tx.lessonProgress.deleteMany({
        where: {
          lessonId: {
            in: lessonIds
          }
        }
      });
    }

    await tx.review.deleteMany({
      where: { courseId: course.id }
    });

    await tx.enrollment.deleteMany({
      where: { courseId: course.id }
    });

    await tx.orderItem.deleteMany({
      where: { courseId: course.id }
    });

    await tx.course.delete({
      where: { id: course.id }
    });
  });

  await Promise.all(uploadUrls.map((fileUrl) => removeStoredUploadByUrl(fileUrl)));

  res.json({
    deleted: true,
    courseId: course.id
  });
}));

router.get('/courses/:courseId', asyncHandler(async (req, res) => {
  const course = await prisma.course.findFirst({
    where: {
      id: req.params.courseId,
      instructorId: req.user.id
    },
    include: pickCourseInclude()
  });

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(mapCourse(course));
}));

router.post('/sections/:sectionId/lessons', uploadVideo.single('video'), asyncHandler(async (req, res) => {
  const section = await prisma.courseSection.findUnique({
    where: { id: req.params.sectionId },
    include: {
      lessons: true,
      course: true
    }
  });

  if (!section || section.course.instructorId !== req.user.id) {
    await removeUploadedFile(req.file);
    return res.status(404).json({ error: 'Section not found' });
  }

  const title = normalizeString(req.body.title, { field: 'title', required: true, min: 2, max: 160 });
  const videoUrl = req.file
    ? buildVideoUrl(req.file)
    : normalizeString(req.body.videoUrl, { field: 'videoUrl', required: true, min: 8, max: 2000 });

  try {
    const lesson = await prisma.lesson.create({
      data: {
        sectionId: section.id,
        title,
        videoProvider: req.file
          ? 'UPLOAD'
          : normalizeString(req.body.videoProvider, { field: 'videoProvider', max: 80 }) || null,
        videoUrl,
        thumbnailUrl: normalizeString(req.body.thumbnailUrl, { field: 'thumbnailUrl', max: 2000 }) || null,
        durationSeconds: normalizeNumber(req.body.durationSeconds, { field: 'durationSeconds', min: 0, integer: true }) || 0,
        isPreview: parseBoolean(req.body.isPreview, false),
        sortOrder: normalizeNumber(req.body.sortOrder, { field: 'sortOrder', min: 1, integer: true }) || section.lessons.length + 1
      }
    });

    res.status(201).json(lesson);
  } catch (error) {
    await removeUploadedFile(req.file);
    throw error;
  }
}));

router.post('/courses/:courseId/submit', asyncHandler(async (req, res) => {
  const course = await prisma.course.findFirst({
    where: {
      id: req.params.courseId,
      instructorId: req.user.id
    },
    include: {
      sections: {
        include: {
          lessons: true
        }
      }
    }
  });

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const lessonsCount = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
  if (course.sections.length === 0 || lessonsCount === 0) {
    return res.status(400).json({ error: 'Course needs at least one section and one lesson before submission' });
  }

  const updated = await prisma.course.update({
    where: { id: course.id },
    data: {
      status: CourseStatus.PENDING_REVIEW,
      rejectedReason: null
    },
    include: pickCourseInclude()
  });

  res.json(mapCourse(updated));
}));

module.exports = router;

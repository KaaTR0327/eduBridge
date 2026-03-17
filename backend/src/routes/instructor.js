const express = require('express');
const { Role, VerificationStatus, CourseStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { requireRole } = require('../middleware/auth');
const { slugify } = require('../utils/slugify');
const { pickCourseInclude, mapCourse } = require('../utils/courseMapper');
const { serializeUser } = require('../utils/serialize');

const router = express.Router();

router.use(requireRole(Role.INSTRUCTOR));

router.post('/apply', asyncHandler(async (req, res) => {
  const { bio, expertise } = req.body;
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

  const { categoryId, title, description, shortDescription, price, thumbnailUrl, level, language } = req.body;

  if (!categoryId || !title || !description || price === undefined) {
    return res.status(400).json({ error: 'categoryId, title, description, and price are required' });
  }

  const course = await prisma.course.create({
    data: {
      instructorId: req.user.id,
      categoryId,
      title,
      slug: `${slugify(title)}-${Date.now()}`,
      description,
      shortDescription,
      price: Number(price),
      thumbnailUrl,
      level,
      language,
      status: CourseStatus.DRAFT
    },
    include: pickCourseInclude()
  });

  res.status(201).json(mapCourse(course));
}));

router.put('/courses/:courseId', asyncHandler(async (req, res) => {
  const existing = await prisma.course.findFirst({
    where: {
      id: req.params.courseId,
      instructorId: req.user.id
    }
  });

  if (!existing) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const updated = await prisma.course.update({
    where: { id: existing.id },
    data: {
      categoryId: req.body.categoryId || existing.categoryId,
      title: req.body.title || existing.title,
      slug: req.body.title ? `${slugify(req.body.title)}-${existing.id.slice(-6)}` : existing.slug,
      description: req.body.description || existing.description,
      shortDescription: req.body.shortDescription !== undefined ? req.body.shortDescription : existing.shortDescription,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      thumbnailUrl: req.body.thumbnailUrl !== undefined ? req.body.thumbnailUrl : existing.thumbnailUrl,
      introVideoUrl: req.body.introVideoUrl !== undefined ? req.body.introVideoUrl : existing.introVideoUrl,
      level: req.body.level !== undefined ? req.body.level : existing.level,
      language: req.body.language !== undefined ? req.body.language : existing.language,
      status: existing.status === CourseStatus.REJECTED ? CourseStatus.DRAFT : existing.status,
      rejectedReason: null
    },
    include: pickCourseInclude()
  });

  res.json(mapCourse(updated));
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
      title: req.body.title,
      sortOrder: req.body.sortOrder || course.sections.length + 1
    }
  });

  res.status(201).json(section);
}));

router.post('/sections/:sectionId/lessons', asyncHandler(async (req, res) => {
  const section = await prisma.courseSection.findUnique({
    where: { id: req.params.sectionId },
    include: {
      lessons: true,
      course: true
    }
  });

  if (!section || section.course.instructorId !== req.user.id) {
    return res.status(404).json({ error: 'Section not found' });
  }

  const lesson = await prisma.lesson.create({
    data: {
      sectionId: section.id,
      title: req.body.title,
      videoProvider: req.body.videoProvider,
      videoUrl: req.body.videoUrl,
      thumbnailUrl: req.body.thumbnailUrl,
      durationSeconds: req.body.durationSeconds ? Number(req.body.durationSeconds) : 0,
      isPreview: Boolean(req.body.isPreview),
      sortOrder: req.body.sortOrder || section.lessons.length + 1
    }
  });

  res.status(201).json(lesson);
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

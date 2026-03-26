const express = require('express');
const { Role, CourseStatus, VerificationStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { requireRole } = require('../middleware/auth');
const { removeStoredUploadByUrl } = require('../middleware/upload');
const { pickCourseInclude, mapCourse } = require('../utils/courseMapper');
const { serializeUser } = require('../utils/serialize');
const { normalizeNumber } = require('../utils/validation');

const router = express.Router();

router.use(requireRole(Role.ADMIN));

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

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    totalInstructors,
    totalCourses,
    pendingCourses,
    totalRevenue,
    todayRevenue,
    topCourse,
    topInstructor,
    pendingInstructorRequests,
    latestPayments
  ] = await Promise.all([
    prisma.user.count(),
    prisma.instructorProfile.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: CourseStatus.PENDING_REVIEW } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'PAID' } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'PAID',
        paidAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }
    }),
    prisma.course.findFirst({
      where: { status: CourseStatus.APPROVED },
      include: pickCourseInclude(),
      orderBy: { enrollments: { _count: 'desc' } }
    }),
    prisma.user.findFirst({
      where: { role: Role.INSTRUCTOR },
      include: {
        instructorProfile: true,
        courses: {
          include: {
            enrollments: true
          }
        }
      }
    }),
    prisma.instructorProfile.findMany({
      where: { verificationStatus: VerificationStatus.PENDING },
      include: { user: true }
    }),
    prisma.payment.findMany({
      include: { order: true },
      orderBy: { paidAt: 'desc' },
      take: 10
    })
  ]);

  res.json({
    metrics: {
      totalUsers,
      totalInstructors,
      totalCourses,
      pendingCourses,
      totalRevenue: totalRevenue._sum.amount || 0,
      todayRevenue: todayRevenue._sum.amount || 0
    },
    pendingInstructorRequests: pendingInstructorRequests.map((profile) => ({
      ...profile,
      user: serializeUser(profile.user)
    })),
    latestPayments,
    topCourse: topCourse ? mapCourse(topCourse) : null,
    topInstructor: topInstructor
      ? {
          id: topInstructor.id,
          fullName: topInstructor.fullName,
          courseCount: topInstructor.courses.length,
          studentCount: topInstructor.courses.reduce((sum, course) => sum + course.enrollments.length, 0)
        }
      : null
  });
}));

router.get('/courses/pending', asyncHandler(async (_req, res) => {
  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PENDING_REVIEW },
    include: pickCourseInclude(),
    orderBy: { updatedAt: 'desc' }
  });

  res.json(courses.map(mapCourse));
}));

router.get('/courses', asyncHandler(async (_req, res) => {
  const courses = await prisma.course.findMany({
    include: pickCourseInclude(),
    orderBy: { updatedAt: 'desc' }
  });

  res.json(courses.map(mapCourse));
}));

router.post('/courses/:courseId/approve', asyncHandler(async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.courseId },
    data: {
      status: CourseStatus.APPROVED,
      publishedAt: new Date(),
      rejectedReason: null
    },
    include: pickCourseInclude()
  });

  res.json(mapCourse(course));
}));

router.post('/courses/:courseId/reject', asyncHandler(async (req, res) => {
  const course = await prisma.course.update({
    where: { id: req.params.courseId },
    data: {
      status: CourseStatus.REJECTED,
      rejectedReason: req.body.reason || 'Needs revision'
    },
    include: pickCourseInclude()
  });

  res.json(mapCourse(course));
}));

router.put('/courses/:courseId', asyncHandler(async (req, res) => {
  const existing = await prisma.course.findUnique({
    where: { id: req.params.courseId }
  });

  if (!existing) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const nextPrice = req.body.price !== undefined
    ? normalizeNumber(req.body.price, { field: 'price', min: 0 })
    : existing.price;

  const updated = await prisma.course.update({
    where: { id: existing.id },
    data: {
      price: nextPrice
    },
    include: pickCourseInclude()
  });

  res.json(mapCourse(updated));
}));

router.delete('/courses/:courseId', asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.courseId },
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
      }
    }
  });

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
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

router.get('/instructors/pending', asyncHandler(async (_req, res) => {
  const profiles = await prisma.instructorProfile.findMany({
    where: { verificationStatus: VerificationStatus.PENDING },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  res.json(profiles.map((profile) => ({
    ...profile,
    user: serializeUser(profile.user)
  })));
}));

router.post('/instructors/:profileId/approve', asyncHandler(async (req, res) => {
  const profile = await prisma.instructorProfile.update({
    where: { id: req.params.profileId },
    data: {
      verificationStatus: VerificationStatus.APPROVED,
      approvedAt: new Date(),
      rejectedReason: null
    },
    include: { user: true }
  });

  res.json({
    ...profile,
    user: serializeUser(profile.user)
  });
}));

router.post('/instructors/:profileId/reject', asyncHandler(async (req, res) => {
  const profile = await prisma.instructorProfile.update({
    where: { id: req.params.profileId },
    data: {
      verificationStatus: VerificationStatus.REJECTED,
      rejectedReason: req.body.reason || 'Requirements not met'
    },
    include: { user: true }
  });

  res.json({
    ...profile,
    user: serializeUser(profile.user)
  });
}));

module.exports = router;

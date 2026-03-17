const express = require('express');
const { Role, CourseStatus, VerificationStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { requireRole } = require('../middleware/auth');
const { pickCourseInclude, mapCourse } = require('../utils/courseMapper');
const { serializeUser } = require('../utils/serialize');

const router = express.Router();

router.use(requireRole(Role.ADMIN));

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

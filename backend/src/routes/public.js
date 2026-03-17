const express = require('express');
const { CourseStatus, VerificationStatus, Role } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { pickCourseInclude, mapCourse } = require('../utils/courseMapper');
const { serializeUser } = require('../utils/serialize');

const router = express.Router();

router.get('/overview', asyncHandler(async (_req, res) => {
  const [totalUsers, totalInstructors, totalCourses, approvedCourses, pendingCourses, payments, featuredCourses] = await Promise.all([
    prisma.user.count(),
    prisma.instructorProfile.count(),
    prisma.course.count(),
    prisma.course.count({ where: { status: CourseStatus.APPROVED } }),
    prisma.course.count({ where: { status: CourseStatus.PENDING_REVIEW } }),
    prisma.payment.findMany({ where: { status: 'PAID' } }),
    prisma.course.findMany({
      where: { status: CourseStatus.APPROVED },
      include: pickCourseInclude(),
      orderBy: { publishedAt: 'desc' },
      take: 6
    })
  ]);

  res.json({
    productName: 'Shine Academy Marketplace',
    summary: 'Admin-controlled multi-instructor platform for selling video lessons online.',
    metrics: {
      totalUsers,
      totalInstructors,
      totalCourses,
      approvedCourses,
      pendingCourses,
      totalRevenue: payments.reduce((sum, payment) => sum + payment.amount, 0),
      totalEnrollments: await prisma.enrollment.count()
    },
    roles: [
      {
        key: 'student',
        label: 'Student',
        abilities: ['Register and login', 'Browse and purchase courses', 'Watch lessons', 'Track progress', 'Leave reviews']
      },
      {
        key: 'instructor',
        label: 'Instructor',
        abilities: ['Apply for instructor access', 'Create courses', 'Manage lessons', 'Submit for review', 'Track earnings']
      },
      {
        key: 'admin',
        label: 'Admin',
        abilities: ['Approve instructors', 'Approve or reject courses', 'Manage users', 'Inspect payments', 'Moderate platform']
      }
    ],
    modules: ['Auth', 'Users', 'Instructor Requests', 'Courses', 'Sections', 'Lessons', 'Orders', 'Payments', 'Enrollments', 'Progress Tracking', 'Reviews', 'Admin Moderation'],
    workflows: {
      instructor: ['Register account', 'Apply to become instructor', 'Admin approval', 'Create draft course', 'Add lessons', 'Submit for review', 'Admin approve/reject'],
      student: ['Browse courses', 'Buy course', 'Payment success', 'Enrollment is created', 'Watch lessons', 'Progress is stored']
    },
    statuses: {
      course: Object.values(CourseStatus).map((value) => value.toLowerCase()),
      instructor: Object.values(VerificationStatus).map((value) => value.toLowerCase()),
      payment: ['pending', 'paid', 'failed', 'refunded']
    },
    pages: {
      public: ['/', '/courses', '/courses/:id', '/login', '/register', '/checkout'],
      student: ['/student/my-courses', '/student/course/:id/learn', '/student/orders'],
      instructor: ['/instructor/dashboard', '/instructor/courses', '/instructor/courses/create'],
      admin: ['/admin/dashboard', '/admin/users', '/admin/courses', '/admin/payments']
    },
    techStack: {
      frontend: ['React', 'Next.js'],
      backend: ['Express', 'Prisma'],
      database: ['SQLite for local dev', 'PostgreSQL or SQL Server later'],
      auth: ['JWT'],
      storage: ['Mux', 'Cloudinary', 'S3'],
      payments: ['QPay', 'Stripe', 'SocialPay']
    },
    featuredCourses: featuredCourses.map(mapCourse)
  });
}));

router.get('/categories', asyncHandler(async (_req, res) => {
  res.json(await prisma.category.findMany({ orderBy: { name: 'asc' } }));
}));

router.get('/courses', asyncHandler(async (req, res) => {
  const where = req.query.includeAll === 'true' ? {} : { status: CourseStatus.APPROVED };
  const courses = await prisma.course.findMany({
    where,
    include: pickCourseInclude(),
    orderBy: { createdAt: 'desc' }
  });

  res.json(courses.map(mapCourse));
}));

router.get('/courses/:courseId', asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({
    where: { id: req.params.courseId },
    include: pickCourseInclude()
  });

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(mapCourse(course));
}));

router.get('/instructors/:instructorId', asyncHandler(async (req, res) => {
  const instructor = await prisma.user.findUnique({
    where: { id: req.params.instructorId },
    include: {
      instructorProfile: true,
      courses: {
        where: { status: CourseStatus.APPROVED },
        include: pickCourseInclude()
      }
    }
  });

  if (!instructor || instructor.role !== Role.INSTRUCTOR) {
    return res.status(404).json({ error: 'Instructor not found' });
  }

  res.json({
    ...serializeUser(instructor),
    courses: instructor.courses.map(mapCourse)
  });
}));

module.exports = router;

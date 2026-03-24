const express = require('express');
const { Role, PaymentStatus, OrderStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { requireRole } = require('../middleware/auth');
const { pickCourseInclude, mapCourse } = require('../utils/courseMapper');
const { serializeUser } = require('../utils/serialize');
const { normalizeNumber, normalizeString } = require('../utils/validation');

const router = express.Router();

router.use(requireRole(Role.STUDENT, Role.INSTRUCTOR, Role.ADMIN));

router.get('/dashboard', asyncHandler(async (req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user.id },
    include: {
      course: {
        include: pickCourseInclude()
      },
      payment: true,
      order: true
    },
    orderBy: { enrolledAt: 'desc' }
  });

  const myCourses = await Promise.all(enrollments.map(async (enrollment) => {
    const lessonIds = enrollment.course.sections.flatMap((section) => section.lessons.map((lesson) => lesson.id));
    const progressCount = await prisma.lessonProgress.count({
      where: {
        userId: req.user.id,
        lessonId: { in: lessonIds },
        isCompleted: true
      }
    });

    return {
      enrollment,
      course: mapCourse(enrollment.course),
      progress: {
        completedLessons: progressCount,
        totalLessons: lessonIds.length
      }
    };
  }));

  res.json({
    student: serializeUser(req.user),
    myCourses
  });
}));

router.post('/courses/:courseId/enroll', asyncHandler(async (req, res) => {
  const course = await prisma.course.findUnique({ where: { id: req.params.courseId } });

  if (!course || course.status !== 'APPROVED') {
    return res.status(404).json({ error: 'Approved course not found' });
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId: course.id
      }
    }
  });

  if (existing) {
    return res.status(409).json({ error: 'Already enrolled' });
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        totalAmount: course.price,
        status: OrderStatus.PAID,
        items: {
          create: [{ courseId: course.id, price: course.price }]
        }
      }
    });

    const payment = await tx.payment.create({
      data: {
        orderId: order.id,
        provider: normalizeString(req.body.provider, { field: 'provider', max: 80 }) || 'SIMULATED',
        paymentMethod: normalizeString(req.body.paymentMethod, { field: 'paymentMethod', max: 80 }) || 'demo',
        providerTransactionId: `demo-${Date.now()}`,
        amount: course.price,
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        rawResponseJson: JSON.stringify({ simulated: true })
      }
    });

    const enrollment = await tx.enrollment.create({
      data: {
        userId: req.user.id,
        courseId: course.id,
        orderId: order.id,
        paymentId: payment.id
      }
    });

    return { order, payment, enrollment };
  });

  res.status(201).json(result);
}));

router.patch('/progress/:lessonId', asyncHandler(async (req, res) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: req.params.lessonId },
    include: {
      section: {
        include: {
          course: true
        }
      }
    }
  });

  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId: lesson.section.courseId
      }
    }
  });

  if (!enrollment) {
    return res.status(403).json({ error: 'You are not enrolled in this course' });
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: req.user.id,
        lessonId: lesson.id
      }
    },
    update: {
      isCompleted: req.body.isCompleted === true,
      lastWatchedSecond: Number(req.body.lastWatchedSecond || 0)
    },
    create: {
      userId: req.user.id,
      lessonId: lesson.id,
      isCompleted: req.body.isCompleted === true,
      lastWatchedSecond: Number(req.body.lastWatchedSecond || 0)
    }
  });

  res.json(progress);
}));

router.post('/reviews', asyncHandler(async (req, res) => {
  const courseId = normalizeString(req.body.courseId, { field: 'courseId', required: true });
  const rating = normalizeNumber(req.body.rating, { field: 'rating', required: true, min: 1, max: 5, integer: true });
  const comment = normalizeString(req.body.comment, { field: 'comment', max: 1000 }) || null;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId
      }
    }
  });

  if (!enrollment) {
    return res.status(403).json({ error: 'You must enroll before reviewing this course' });
  }

  const review = await prisma.review.upsert({
    where: {
      userId_courseId: {
        userId: req.user.id,
        courseId
      }
    },
    update: {
      rating,
      comment
    },
    create: {
      userId: req.user.id,
      courseId,
      rating,
      comment
    }
  });

  res.status(201).json(review);
}));

module.exports = router;

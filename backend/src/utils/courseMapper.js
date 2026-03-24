function pickCourseInclude() {
  return {
    instructor: {
      select: {
        id: true,
        fullName: true,
        email: true,
        instructorProfile: {
          select: {
            expertise: true,
            verificationStatus: true
          }
        }
      }
    },
    category: true,
    sections: {
      orderBy: { sortOrder: 'asc' },
      include: {
        lessons: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    },
    reviews: {
      include: {
        user: {
          select: {
            id: true,
            fullName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    },
    _count: {
      select: {
        enrollments: true,
        reviews: true
      }
    }
  };
}

function mapCourse(course) {
  const sections = Array.isArray(course.sections) ? course.sections : [];
  const reviews = Array.isArray(course.reviews) ? course.reviews : [];
  const lessonCount = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  const durationSeconds = sections.reduce(
    (sum, section) => sum + section.lessons.reduce((inner, lesson) => inner + lesson.durationSeconds, 0),
    0
  );
  const averageRating = reviews.length
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
    : 0;

  return {
    ...course,
    lessonCount,
    durationHours: Number((durationSeconds / 3600).toFixed(1)),
    averageRating,
    studentsCount: course._count?.enrollments || 0,
    reviewsCount: course._count?.reviews || 0
  };
}

module.exports = {
  pickCourseInclude,
  mapCourse
};

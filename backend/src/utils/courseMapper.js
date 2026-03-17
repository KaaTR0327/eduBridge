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
  const lessonCount = course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
  const durationSeconds = course.sections.reduce(
    (sum, section) => sum + section.lessons.reduce((inner, lesson) => inner + lesson.durationSeconds, 0),
    0
  );
  const averageRating = course.reviews.length
    ? Number((course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length).toFixed(1))
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

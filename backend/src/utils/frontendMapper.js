const { slugify } = require('./slugify');

function pickFrontendCourseInclude() {
  return {
    instructor: {
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        instructorProfile: {
          select: {
            bio: true,
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

function buildCreatorSlug(user) {
  const base = slugify(user?.fullName || user?.name || 'creator');
  return base || 'creator';
}

function collectCourseStats(course) {
  const sections = course.sections || [];
  const reviews = course.reviews || [];
  const lessonCount = sections.reduce((sum, section) => sum + section.lessons.length, 0);
  const durationSeconds = sections.reduce(
    (sum, section) => sum + section.lessons.reduce((inner, lesson) => inner + lesson.durationSeconds, 0),
    0
  );

  return {
    lessonCount,
    durationHours: Number((durationSeconds / 3600).toFixed(1)),
    rating: reviews.length
      ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
      : 0,
    downloads: course._count?.enrollments || 0,
    reviewsCount: course._count?.reviews || reviews.length
  };
}

function buildFileType(course, lessonCount) {
  const parts = [
    course.language || 'English',
    course.level || 'Beginner',
    `${lessonCount} lesson${lessonCount === 1 ? '' : 's'}`
  ];

  return parts.join(' | ');
}

function buildTags(course) {
  const source = [
    course.title,
    course.shortDescription,
    course.description,
    course.category?.name,
    course.language,
    course.level,
    course.instructor?.instructorProfile?.expertise
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  const knownTags = [
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'API',
    'Design',
    'UI',
    'UX',
    'Figma',
    'Data',
    'SQL',
    'JavaScript',
    'TypeScript',
    'Python'
  ];

  const matches = knownTags.filter((tag) => {
    const normalized = tag.toLowerCase().replace('.', '');
    return source.includes(tag.toLowerCase()) || source.includes(normalized);
  });

  return Array.from(
    new Set([
      ...matches,
      course.category?.name,
      course.language,
      course.level
    ].filter(Boolean))
  ).slice(0, 6);
}

function mapFrontendReview(review) {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    user: {
      id: review.user?.id,
      name: review.user?.fullName || 'EduBridge User'
    }
  };
}

function mapResourceCreator(instructor) {
  if (!instructor) {
    return null;
  }

  return {
    id: instructor.id,
    slug: buildCreatorSlug(instructor),
    name: instructor.fullName,
    expertise: instructor.instructorProfile?.expertise || 'Creator',
    role: instructor.instructorProfile?.expertise || 'Creator',
    bio: instructor.instructorProfile?.bio || '',
    avatar: instructor.avatarUrl || '',
    socials: {
      website: '',
      x: '',
      linkedin: ''
    }
  };
}

function mapPublicSections(sections) {
  return (sections || []).map((section) => ({
    id: section.id,
    title: section.title,
    sortOrder: section.sortOrder,
    lessons: (section.lessons || []).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      durationSeconds: lesson.durationSeconds,
      isPreview: lesson.isPreview,
      sortOrder: lesson.sortOrder
    }))
  }));
}

function mapFrontendResource(course) {
  const stats = collectCourseStats(course);
  const sections = course.sections || [];
  const previewLesson = sections
    .flatMap((section) => section.lessons || [])
    .find((lesson) => lesson.isPreview);
  const previewSource = course.shortDescription || previewLesson?.title || course.description;
  const preview = previewSource.length > 160 ? `${previewSource.slice(0, 157).trim()}...` : previewSource;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    shortDescription: course.shortDescription || preview,
    description: course.description,
    preview,
    price: course.price,
    isFree: Number(course.price) === 0,
    cover: course.thumbnailUrl || '',
    category: course.category,
    creator: mapResourceCreator(course.instructor),
    type: 'Course',
    fileType: buildFileType(course, stats.lessonCount),
    tags: buildTags(course),
    downloads: stats.downloads,
    favorites: stats.reviewsCount,
    rating: stats.rating,
    reviewsCount: stats.reviewsCount,
    lessonCount: stats.lessonCount,
    durationHours: stats.durationHours,
    introVideoUrl: course.introVideoUrl || '',
    previewVideoUrl: previewLesson?.videoUrl || course.introVideoUrl || '',
    language: course.language || 'English',
    level: course.level || 'Beginner',
    status: course.status,
    createdAt: course.publishedAt || course.createdAt,
    reviews: (course.reviews || []).map(mapFrontendReview),
    sections: mapPublicSections(sections)
  };
}

function mapFrontendCreator(user) {
  const courses = user.courses || [];
  const allReviews = courses.flatMap((course) => course.reviews || []);
  const totalDownloads = courses.reduce((sum, course) => sum + (course._count?.enrollments || 0), 0);
  const reviewCount = courses.reduce((sum, course) => sum + (course._count?.reviews || 0), 0);

  return {
    id: user.id,
    slug: buildCreatorSlug(user),
    name: user.fullName,
    expertise: user.instructorProfile?.expertise || 'Creator',
    role: user.instructorProfile?.expertise || 'Creator',
    bio: user.instructorProfile?.bio || '',
    avatar: user.avatarUrl || '',
    totalDownloads,
    rating: allReviews.length
      ? Number((allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1))
      : 0,
    reviewCount,
    socials: {
      website: '',
      x: '',
      linkedin: ''
    }
  };
}

module.exports = {
  buildCreatorSlug,
  mapFrontendCreator,
  mapFrontendResource,
  pickFrontendCourseInclude
};

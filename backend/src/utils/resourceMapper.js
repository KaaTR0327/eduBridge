const { mapCourse } = require('./courseMapper');
const { slugify } = require('./slugify');

function mapInstructorToCreator(instructor) {
  if (!instructor) {
    return null;
  }

  return {
    id: instructor.id,
    slug: slugify(instructor.fullName),
    name: instructor.fullName,
    bio: instructor.instructorProfile?.bio || 'Publishes structured digital resources and learning materials.',
    expertise: instructor.instructorProfile?.expertise || 'Digital resource creator',
    verificationStatus: instructor.instructorProfile?.verificationStatus || 'PENDING'
  };
}

function mapCourseToResource(course) {
  const mapped = mapCourse(course);
  const fileTypeParts = [mapped.language, mapped.level, `${mapped.lessonCount} lessons`].filter(Boolean);

  return {
    id: mapped.id,
    slug: mapped.slug,
    title: mapped.title,
    shortDescription: mapped.shortDescription,
    description: mapped.description,
    price: mapped.price,
    isFree: Number(mapped.price) === 0,
    cover: mapped.thumbnailUrl,
    preview: mapped.shortDescription || mapped.description,
    category: {
      id: mapped.category?.id,
      name: mapped.category?.name,
      slug: mapped.category?.slug
    },
    creator: mapInstructorToCreator(mapped.instructor),
    fileType: fileTypeParts.join(' | '),
    tags: [mapped.category?.name, mapped.language, mapped.level].filter(Boolean),
    downloads: mapped.studentsCount,
    favorites: mapped.reviewsCount,
    rating: mapped.averageRating,
    reviewsCount: mapped.reviewsCount,
    lessonCount: mapped.lessonCount,
    durationHours: mapped.durationHours,
    language: mapped.language,
    level: mapped.level,
    status: mapped.status,
    createdAt: mapped.createdAt,
    updatedAt: mapped.updatedAt
  };
}

module.exports = {
  mapCourseToResource,
  mapInstructorToCreator
};

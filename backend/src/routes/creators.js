const express = require('express');
const { Role, CourseStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { pickCourseInclude } = require('../utils/courseMapper');
const { mapCourseToResource, mapInstructorToCreator } = require('../utils/resourceMapper');
const { slugify } = require('../utils/slugify');
const { normalizePagination, normalizeString } = require('../utils/validation');

const router = express.Router();

function mapCreatorSummary(creator) {
  const resources = creator.courses.map(mapCourseToResource);
  const downloads = resources.reduce((sum, item) => sum + item.downloads, 0);
  const ratings = resources.filter((item) => item.rating > 0).map((item) => item.rating);

  return {
    ...mapInstructorToCreator(creator),
    totalDownloads: downloads,
    rating: ratings.length ? Number((ratings.reduce((sum, item) => sum + item, 0) / ratings.length).toFixed(1)) : 0,
    reviewCount: resources.reduce((sum, item) => sum + item.reviewsCount, 0),
    resourceCount: resources.length
  };
}

function sortCreators(creators, sort) {
  switch ((sort || '').toLowerCase()) {
    case 'downloads':
      return creators.sort((a, b) => b.totalDownloads - a.totalDownloads || a.name.localeCompare(b.name));
    case 'resources':
      return creators.sort((a, b) => b.resourceCount - a.resourceCount || a.name.localeCompare(b.name));
    case 'rating':
      return creators.sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name));
    case 'name':
    default:
      return creators.sort((a, b) => a.name.localeCompare(b.name));
  }
}

router.get('/', asyncHandler(async (req, res) => {
  const search = normalizeString(req.query.q, { field: 'q', max: 120 });
  const expertise = normalizeString(req.query.expertise, { field: 'expertise', max: 120 });
  const { page, limit, skip } = normalizePagination(req.query, { page: 1, limit: 24 });

  const creators = await prisma.user.findMany({
    where: {
      role: Role.INSTRUCTOR,
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { instructorProfile: { is: { bio: { contains: search, mode: 'insensitive' } } } },
              { instructorProfile: { is: { expertise: { contains: search, mode: 'insensitive' } } } }
            ]
          }
        : {}),
      ...(expertise
        ? {
            instructorProfile: {
              is: {
                expertise: { contains: expertise, mode: 'insensitive' }
              }
            }
          }
        : {})
    },
    include: {
      instructorProfile: true,
      courses: {
        where: { status: CourseStatus.APPROVED },
        include: pickCourseInclude()
      }
    }
  });

  const summaries = sortCreators(creators.map(mapCreatorSummary), req.query.sort);
  const paginated = summaries.slice(skip, skip + limit);

  res.set('X-Total-Count', String(summaries.length));
  res.set('X-Page', String(page));
  res.set('X-Limit', String(limit));
  res.json(paginated);
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const creators = await prisma.user.findMany({
    where: { role: Role.INSTRUCTOR },
    include: {
      instructorProfile: true,
      courses: {
        where: { status: CourseStatus.APPROVED },
        include: pickCourseInclude()
      }
    }
  });

  const creator = creators.find((item) => slugify(item.fullName) === req.params.slug || item.id === req.params.slug);

  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }

  const resources = creator.courses.map(mapCourseToResource);
  const summary = mapCreatorSummary(creator);

  res.json({
    ...summary,
    resources
  });
}));

module.exports = router;

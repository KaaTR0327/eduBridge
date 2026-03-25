const express = require('express');
const { CourseStatus, Role, VerificationStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { mapFrontendCreator } = require('../utils/frontendMapper');

const router = express.Router();

async function fetchApprovedCreators() {
  const creators = await prisma.user.findMany({
    where: {
      role: Role.INSTRUCTOR,
      instructorProfile: {
        is: {
          verificationStatus: VerificationStatus.APPROVED
        }
      },
      courses: {
        some: {
          status: CourseStatus.APPROVED
        }
      }
    },
    include: {
      instructorProfile: true,
      courses: {
        where: {
          status: CourseStatus.APPROVED
        },
        include: {
          reviews: true,
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        }
      }
    }
  });

  return creators
    .map(mapFrontendCreator)
    .sort((left, right) => {
      if (right.totalDownloads !== left.totalDownloads) {
        return right.totalDownloads - left.totalDownloads;
      }

      return right.rating - left.rating;
    });
}

router.get('/', asyncHandler(async (_req, res) => {
  const creators = await fetchApprovedCreators();
  res.json(creators);
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const creators = await fetchApprovedCreators();
  const creator = creators.find((item) => item.slug === req.params.slug);

  if (!creator) {
    return res.status(404).json({ error: 'Creator not found' });
  }

  return res.json(creator);
}));

module.exports = router;

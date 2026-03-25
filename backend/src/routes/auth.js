const express = require('express');
const bcrypt = require('bcryptjs');
const { Role, VerificationStatus } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { signToken, authenticate } = require('../middleware/auth');
const { serializeUser } = require('../utils/serialize');
const { normalizeEmail, normalizePassword, normalizeRole, normalizeString } = require('../utils/validation');
const { badRequest } = require('../utils/http');

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
  const fullName = normalizeString(req.body.fullName, { field: 'fullName', required: true, min: 2, max: 120 });
  const email = normalizeEmail(req.body.email);
  const password = normalizePassword(req.body.password);
  const normalizedRole = normalizeRole(req.body.role, Role.STUDENT);
  const passwordHash = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw badRequest('email already exists');
  }

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role: normalizedRole
    }
  });

  if (normalizedRole === Role.INSTRUCTOR) {
    await prisma.instructorProfile.create({
      data: {
        userId: user.id,
        verificationStatus: VerificationStatus.APPROVED,
        approvedAt: new Date()
      }
    });
  }

  const freshUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { instructorProfile: true }
  });

  return res.status(201).json({
    token: signToken(freshUser),
    user: serializeUser(freshUser)
  });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = normalizeString(req.body.password, { field: 'password', required: true, min: 6, max: 128 });

  const user = await prisma.user.findUnique({
    where: { email },
    include: { instructorProfile: true }
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Account is not active' });
  }

  return res.json({
    token: signToken(user),
    user: serializeUser(user)
  });
}));

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  return res.json({ user: serializeUser(req.user) });
}));

module.exports = router;

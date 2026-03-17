const express = require('express');
const bcrypt = require('bcryptjs');
const { Role } = require('@prisma/client');
const prisma = require('../lib/prisma');
const asyncHandler = require('../middleware/asyncHandler');
const { signToken, authenticate } = require('../middleware/auth');
const { serializeUser } = require('../utils/serialize');

const router = express.Router();

router.post('/register', asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'fullName, email, and password are required' });
  }

  const normalizedRole = role && Object.values(Role).includes(role) && role !== Role.ADMIN ? role : Role.STUDENT;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      role: normalizedRole
    }
  });

  if (normalizedRole === Role.INSTRUCTOR) {
    await prisma.instructorProfile.create({
      data: {
        userId: user.id
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: { instructorProfile: true }
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
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

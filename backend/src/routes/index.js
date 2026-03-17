const express = require('express');
const publicRoutes = require('./public');
const authRoutes = require('./auth');
const instructorRoutes = require('./instructor');
const studentRoutes = require('./student');
const adminRoutes = require('./admin');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/instructor', authenticate, instructorRoutes);
router.use('/student', authenticate, studentRoutes);
router.use('/admin', authenticate, adminRoutes);

module.exports = router;

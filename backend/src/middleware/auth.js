const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { HttpError } = require('../utils/http');

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const token = header.slice('Bearer '.length);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { instructorProfile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token user' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, 'Forbidden for this role'));
    }

    return next();
  };
}

module.exports = {
  signToken,
  authenticate,
  requireRole
};

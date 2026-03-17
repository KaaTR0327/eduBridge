function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error.code === 'P2002') {
    return res.status(409).json({ error: 'Unique constraint violation', target: error.meta?.target || null });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;

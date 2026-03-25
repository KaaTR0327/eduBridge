const { HttpError } = require('../utils/http');

function errorHandler(error, _req, res, _next) {
  console.error(error);

  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.message,
      details: error.details || null
    });
  }

  if (error.code === 'P2002') {
    const target = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : error.meta?.target || null;
    return res.status(409).json({ error: target ? `${target} already exists` : 'Unique constraint violation', target });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({ error: 'Requested record was not found' });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Video file is too large. Max size is 500MB.' });
  }

  if (error.name === 'MulterError') {
    return res.status(400).json({ error: error.message || 'Invalid file upload request' });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message || 'Request failed' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;

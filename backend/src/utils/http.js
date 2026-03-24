class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details || null;
  }
}

function badRequest(message, details) {
  return new HttpError(400, message, details);
}

function assert(condition, message, details) {
  if (!condition) {
    throw badRequest(message, details);
  }
}

module.exports = {
  HttpError,
  badRequest,
  assert
};

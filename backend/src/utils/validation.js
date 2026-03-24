const { Role } = require('@prisma/client');
const { badRequest, assert } = require('./http');

function normalizeString(value, { field, required = false, min = 0, max } = {}) {
  if (value === undefined || value === null) {
    if (required) {
      throw badRequest(`${field} is required`);
    }
    return undefined;
  }

  const normalized = String(value).trim();

  if (required) {
    assert(normalized.length > 0, `${field} is required`);
  }

  if (normalized.length > 0 && min) {
    assert(normalized.length >= min, `${field} must be at least ${min} characters`);
  }

  if (normalized.length > 0 && max) {
    assert(normalized.length <= max, `${field} must be at most ${max} characters`);
  }

  return normalized;
}

function normalizeEmail(value) {
  const email = normalizeString(value, { field: 'email', required: true, min: 5, max: 160 }).toLowerCase();
  assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'email must be a valid email address');
  return email;
}

function normalizePassword(value) {
  const password = normalizeString(value, { field: 'password', required: true, min: 6, max: 128 });
  assert(/[A-Za-z]/.test(password) && /\d/.test(password), 'password must contain at least one letter and one number');
  return password;
}

function normalizeNumber(value, { field, required = false, min, max, integer = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw badRequest(`${field} is required`);
    }
    return undefined;
  }

  const normalized = Number(value);
  assert(Number.isFinite(normalized), `${field} must be a valid number`);

  if (integer) {
    assert(Number.isInteger(normalized), `${field} must be an integer`);
  }

  if (min !== undefined) {
    assert(normalized >= min, `${field} must be at least ${min}`);
  }

  if (max !== undefined) {
    assert(normalized <= max, `${field} must be at most ${max}`);
  }

  return normalized;
}

function normalizeBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalized);
}

function normalizeRole(value, fallback = Role.STUDENT) {
  if (!value || !Object.values(Role).includes(value) || value === Role.ADMIN) {
    return fallback;
  }

  return value;
}

function normalizePagination(query, defaults = {}) {
  const page = normalizeNumber(query.page, { field: 'page', min: 1, integer: true }) || defaults.page || 1;
  const limit = normalizeNumber(query.limit, { field: 'limit', min: 1, max: 50, integer: true }) || defaults.limit || 20;

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}

module.exports = {
  normalizeString,
  normalizeEmail,
  normalizePassword,
  normalizeNumber,
  normalizeBoolean,
  normalizeRole,
  normalizePagination
};

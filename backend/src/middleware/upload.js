const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');
const VIDEO_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'videos');
const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;
const ALLOWED_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogg', '.avi', '.mkv']);

fs.mkdirSync(VIDEO_UPLOAD_DIR, { recursive: true });

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function pickFileExtension(file) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  return ALLOWED_VIDEO_EXTENSIONS.has(extension) ? extension : '.mp4';
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, VIDEO_UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniqueSuffix}${pickFileExtension(file)}`);
  }
});

const uploadVideo = multer({
  storage,
  limits: {
    fileSize: MAX_VIDEO_SIZE_BYTES
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();
    const isAllowedMime = typeof file.mimetype === 'string' && file.mimetype.startsWith('video/');
    const isAllowedExtension = !extension || ALLOWED_VIDEO_EXTENSIONS.has(extension);

    if (!isAllowedMime || !isAllowedExtension) {
      return callback(createHttpError('Only video files are allowed.'));
    }

    return callback(null, true);
  }
});

function resolveStoredUploadPath(fileUrl) {
  if (typeof fileUrl !== 'string' || !fileUrl.startsWith('/uploads/')) {
    return null;
  }

  const normalizedPath = fileUrl.replace(/^\/+/, '');
  const resolvedPath = path.resolve(__dirname, '..', '..', normalizedPath);

  if (!resolvedPath.startsWith(UPLOAD_ROOT)) {
    return null;
  }

  return resolvedPath;
}

function buildVideoUrl(file) {
  if (!file?.filename) {
    return null;
  }

  return `/uploads/videos/${file.filename}`;
}

async function removeUploadedFile(file) {
  if (!file?.path) {
    return;
  }

  try {
    await fs.promises.unlink(file.path);
  } catch (_error) {
    // Ignore cleanup failures so the original request error is preserved.
  }
}

async function removeStoredUploadByUrl(fileUrl) {
  const storedPath = resolveStoredUploadPath(fileUrl);
  if (!storedPath) {
    return;
  }

  try {
    await fs.promises.unlink(storedPath);
  } catch (_error) {
    // Ignore cleanup failures so course deletion does not fail after DB changes.
  }
}

module.exports = {
  MAX_VIDEO_SIZE_BYTES,
  buildVideoUrl,
  removeUploadedFile,
  removeStoredUploadByUrl,
  uploadVideo
};

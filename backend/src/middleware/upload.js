const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'uploads');
const VIDEO_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'videos');
const IMAGE_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'images');
const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogg', '.avi', '.mkv']);
const ALLOWED_IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

fs.mkdirSync(VIDEO_UPLOAD_DIR, { recursive: true });
fs.mkdirSync(IMAGE_UPLOAD_DIR, { recursive: true });

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function pickFileExtension(file, allowedExtensions, fallbackExtension) {
  const extension = path.extname(file.originalname || '').toLowerCase();
  return allowedExtensions.has(extension) ? extension : fallbackExtension;
}

const videoStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, VIDEO_UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniqueSuffix}${pickFileExtension(file, ALLOWED_VIDEO_EXTENSIONS, '.mp4')}`);
  }
});

const courseAssetStorage = multer.diskStorage({
  destination: (_req, file, callback) => {
    callback(null, file.fieldname === 'thumbnail' ? IMAGE_UPLOAD_DIR : VIDEO_UPLOAD_DIR);
  },
  filename: (_req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.fieldname === 'thumbnail'
      ? pickFileExtension(file, ALLOWED_IMAGE_EXTENSIONS, '.jpg')
      : pickFileExtension(file, ALLOWED_VIDEO_EXTENSIONS, '.mp4');

    callback(null, `${uniqueSuffix}${extension}`);
  }
});

const uploadVideo = multer({
  storage: videoStorage,
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

const uploadCourseAssets = multer({
  storage: courseAssetStorage,
  limits: {
    fileSize: MAX_VIDEO_SIZE_BYTES
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || '').toLowerCase();

    if (file.fieldname === 'thumbnail') {
      const isAllowedMime = typeof file.mimetype === 'string' && file.mimetype.startsWith('image/');
      const isAllowedExtension = !extension || ALLOWED_IMAGE_EXTENSIONS.has(extension);

      if (!isAllowedMime || !isAllowedExtension) {
        return callback(createHttpError('Only image files are allowed for course thumbnails.'));
      }

      return callback(null, true);
    }

    const isAllowedMime = typeof file.mimetype === 'string' && file.mimetype.startsWith('video/');
    const isAllowedExtension = !extension || ALLOWED_VIDEO_EXTENSIONS.has(extension);

    if (!isAllowedMime || !isAllowedExtension) {
      return callback(createHttpError('Only video files are allowed for course lessons.'));
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

function buildImageUrl(file) {
  if (!file?.filename) {
    return null;
  }

  return `/uploads/images/${file.filename}`;
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

async function removeUploadedFiles(files) {
  const allFiles = Array.isArray(files)
    ? files
    : Object.values(files || {}).flat();

  await Promise.all(allFiles.map((file) => removeUploadedFile(file)));
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
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
  buildImageUrl,
  buildVideoUrl,
  removeUploadedFile,
  removeUploadedFiles,
  removeStoredUploadByUrl,
  uploadCourseAssets,
  uploadVideo
};

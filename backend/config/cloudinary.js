const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET &&
         process.env.CLOUDINARY_CLOUD_NAME !== 'your-cloudinary-cloud-name' &&
         process.env.CLOUDINARY_API_KEY !== 'your-cloudinary-api-key' &&
         process.env.CLOUDINARY_API_SECRET !== 'your-cloudinary-api-secret';
};

let storage;
let upload;

if (isCloudinaryConfigured()) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Configure Cloudinary Storage for Multer
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'real-estate-properties',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
    },
  });

  console.log('✅ Cloudinary configured successfully');
} else {
  // Fallback to local storage when Cloudinary is not configured
  console.log('⚠️  Cloudinary not configured, using local storage fallback');
  
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// Multer upload middleware
upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
    }
  },
});

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    if (isCloudinaryConfigured()) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } else {
      console.log('Cloudinary not configured, skipping image deletion');
      return { result: 'ok' };
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!isCloudinaryConfigured()) {
    return url; // Return the URL as-is for local storage
  }
  
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename.split('.')[0]}`;
};

module.exports = {
  cloudinary: isCloudinaryConfigured() ? cloudinary : null,
  upload,
  deleteImage,
  getPublicIdFromUrl,
  isCloudinaryConfigured,
};

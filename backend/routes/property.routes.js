const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  toggleFeatured,
  getMyProperties,
} = require('../controllers/property.controller');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const {
  propertyValidator,
  propertyUpdateValidator,
  propertyQueryValidator,
  mongoIdValidator,
} = require('../middleware/validators');
const { upload } = require('../config/cloudinary');

// Public routes (with optional auth for view tracking)
router.get('/', optionalAuth, propertyQueryValidator, getProperties);
router.get('/:id', optionalAuth, mongoIdValidator, getProperty);

// Protected routes - Agent
router.use(protect);

// Agent routes
router.get('/agent/my-properties', authorize('agent', 'admin'), getMyProperties);
router.post(
  '/',
  authorize('agent', 'admin'),
  upload.array('images', 10),
  propertyValidator,
  createProperty
);
router.put(
  '/:id',
  authorize('agent', 'admin'),
  upload.array('images', 10),
  mongoIdValidator,
  propertyUpdateValidator,
  updateProperty
);
router.delete('/:id', authorize('agent', 'admin'), mongoIdValidator, deleteProperty);

// Admin only routes
router.put('/:id/approve', authorize('admin'), mongoIdValidator, approveProperty);
router.put('/:id/featured', authorize('admin'), mongoIdValidator, toggleFeatured);

module.exports = router;

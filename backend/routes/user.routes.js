const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUser,
  toggleBlockUser,
  updateUserRole,
  deleteUser,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const { profileUpdateValidator, mongoIdValidator } = require('../middleware/validators');
const { upload } = require('../config/cloudinary');

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile', getProfile);
router.put('/profile', upload.single('avatar'), profileUpdateValidator, updateProfile);
router.put('/change-password', changePassword);

// Admin only routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), mongoIdValidator, getUser);
router.put('/:id/block', authorize('admin'), mongoIdValidator, toggleBlockUser);
router.put('/:id/role', authorize('admin'), mongoIdValidator, updateUserRole);
router.delete('/:id', authorize('admin'), mongoIdValidator, deleteUser);

module.exports = router;

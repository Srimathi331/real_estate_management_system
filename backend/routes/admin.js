const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  getProperties,
  getInquiries,
  toggleUserBlock,
  togglePropertyApproval,
  deleteUser,
  deleteProperty
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id/toggle-block', toggleUserBlock);
router.delete('/users/:id', deleteUser);

// Property management
router.get('/properties', getProperties);
router.put('/properties/:id/toggle-approval', togglePropertyApproval);
router.delete('/properties/:id', deleteProperty);

// Inquiry management
router.get('/inquiries', getInquiries);

module.exports = router;
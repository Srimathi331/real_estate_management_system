const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  getMyInquiries,
} = require('../controllers/inquiry.controller');
const { protect, authorize } = require('../middleware/auth');
const { inquiryValidator, mongoIdValidator } = require('../middleware/validators');

// All routes require authentication
router.use(protect);

// User routes
router.post('/', inquiryValidator, createInquiry);
router.get('/my-inquiries', getMyInquiries);

// Agent/Admin routes - Remove inquiryValidator from GET route
router.get('/', authorize('agent', 'admin'), getInquiries);
router.get('/:id', authorize('agent', 'admin'), mongoIdValidator, getInquiry);
router.put('/:id', authorize('agent', 'admin'), mongoIdValidator, updateInquiry);

// Admin only
router.delete('/:id', authorize('admin'), mongoIdValidator, deleteInquiry);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAgentDashboard,
  getUserDashboard,
} = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Role-specific dashboards
router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/agent', authorize('agent'), getAgentDashboard);
router.get('/user', getUserDashboard);

module.exports = router;

const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/dashboard/admin
 * @access  Private/Admin
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
  // Get counts
  const [
    totalUsers,
    totalAgents,
    totalProperties,
    approvedProperties,
    pendingProperties,
    totalInquiries,
    unreadInquiries,
  ] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'agent' }),
    Property.countDocuments(),
    Property.countDocuments({ isApproved: true }),
    Property.countDocuments({ isApproved: false }),
    Inquiry.countDocuments(),
    Inquiry.countDocuments({ isRead: false }),
  ]);

  // Get recent users
  const recentUsers = await User.find()
    .select('name email role createdAt avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent properties
  const recentProperties = await Property.find()
    .populate('agent', 'name email')
    .select('title price type category isApproved createdAt images')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get pending properties for approval
  const pendingApprovals = await Property.find({ isApproved: false })
    .populate('agent', 'name email')
    .select('title price type category createdAt images')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get properties by category
  const propertiesByCategory = await Property.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Get properties by type
  const propertiesByType = await Property.aggregate([
    { $match: { isApproved: true } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ]);

  // Get monthly stats (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await Property.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
        totalValue: { $sum: '$price' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalAgents,
        totalProperties,
        approvedProperties,
        pendingProperties,
        totalInquiries,
        unreadInquiries,
      },
      recentUsers,
      recentProperties,
      pendingApprovals,
      propertiesByCategory,
      propertiesByType,
      monthlyStats,
    },
  });
});

/**
 * @desc    Get agent dashboard stats
 * @route   GET /api/dashboard/agent
 * @access  Private/Agent
 */
const getAgentDashboard = asyncHandler(async (req, res) => {
  const agentId = req.user._id;

  // Get counts
  const [
    totalProperties,
    approvedProperties,
    pendingProperties,
    totalInquiries,
    unreadInquiries,
    totalViews,
  ] = await Promise.all([
    Property.countDocuments({ agent: agentId }),
    Property.countDocuments({ agent: agentId, isApproved: true }),
    Property.countDocuments({ agent: agentId, isApproved: false }),
    Inquiry.countDocuments({ agent: agentId }),
    Inquiry.countDocuments({ agent: agentId, isRead: false }),
    Property.aggregate([
      { $match: { agent: agentId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]),
  ]);

  // Get recent properties
  const recentProperties = await Property.find({ agent: agentId })
    .select('title price type category isApproved status views createdAt images')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent inquiries
  const recentInquiries = await Inquiry.find({ agent: agentId })
    .populate('user', 'name email avatar')
    .populate('property', 'title images')
    .select('message status isRead createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get properties by status
  const propertiesByStatus = await Property.aggregate([
    { $match: { agent: agentId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Get inquiry stats (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const inquiryStats = await Inquiry.aggregate([
    {
      $match: {
        agent: agentId,
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Get top performing properties
  const topProperties = await Property.find({ agent: agentId, isApproved: true })
    .select('title price views inquiryCount images')
    .sort({ views: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalProperties,
        approvedProperties,
        pendingProperties,
        totalInquiries,
        unreadInquiries,
        totalViews: totalViews[0]?.totalViews || 0,
      },
      recentProperties,
      recentInquiries,
      propertiesByStatus,
      inquiryStats,
      topProperties,
    },
  });
});

/**
 * @desc    Get user dashboard stats
 * @route   GET /api/dashboard/user
 * @access  Private
 */
const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user with wishlist
  const user = await User.findById(userId).populate({
    path: 'wishlist',
    match: { isApproved: true },
    select: 'title price type category images location',
  });

  // Get user's inquiries
  const [totalInquiries, respondedInquiries] = await Promise.all([
    Inquiry.countDocuments({ user: userId }),
    Inquiry.countDocuments({ user: userId, status: 'responded' }),
  ]);

  // Get recent inquiries
  const recentInquiries = await Inquiry.find({ user: userId })
    .populate('property', 'title images price')
    .populate('agent', 'name email')
    .select('status isRead createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recommended properties based on wishlist categories
  let recommendedProperties = [];
  if (user.wishlist.length > 0) {
    const categories = [...new Set(user.wishlist.map((p) => p.category))];
    recommendedProperties = await Property.find({
      _id: { $nin: user.wishlist.map((p) => p._id) },
      isApproved: true,
      category: { $in: categories },
    })
      .populate('agent', 'name')
      .select('title price type category images location features')
      .limit(6);
  } else {
    // Get featured or popular properties
    recommendedProperties = await Property.find({ isApproved: true, isFeatured: true })
      .populate('agent', 'name')
      .select('title price type category images location features')
      .limit(6);
  }

  res.status(200).json({
    success: true,
    data: {
      stats: {
        wishlistCount: user.wishlist.length,
        totalInquiries,
        respondedInquiries,
      },
      wishlist: user.wishlist,
      recentInquiries,
      recommendedProperties,
    },
  });
});

module.exports = {
  getAdminDashboard,
  getAgentDashboard,
  getUserDashboard,
};

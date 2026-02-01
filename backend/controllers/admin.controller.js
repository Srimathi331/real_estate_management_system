const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    
    // Get active agents (agents with at least one property)
    const activeAgents = await Property.distinct('agent').then(agents => agents.length);
    
    // Get pending approvals
    const pendingApprovals = await Property.countDocuments({ isApproved: false });
    
    // Calculate total revenue (sum of all property prices for sold/rented properties)
    const revenueData = await Property.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.json({
      totalUsers,
      totalProperties,
      totalInquiries,
      activeAgents,
      pendingApprovals,
      totalRevenue
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all properties with pagination
// @route   GET /api/admin/properties
// @access  Private/Admin
const getProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find()
      .populate('agent', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments();

    res.json({
      properties,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all inquiries with pagination
// @route   GET /api/admin/inquiries
// @access  Private/Admin
const getInquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const inquiries = await Inquiry.find()
      .populate('user', 'name email')
      .populate('property', 'title location.city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Inquiry.countDocuments();

    res.json({
      success: true,
      data: {
        inquiries,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/toggle-block
// @access  Private/Admin
const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow blocking other admins
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block admin users' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    console.error('Error toggling user block:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve/Reject property
// @route   PUT /api/admin/properties/:id/toggle-approval
// @access  Private/Admin
const togglePropertyApproval = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isApproved = !property.isApproved;
    await property.save();

    res.json({
      message: `Property ${property.isApproved ? 'approved' : 'rejected'} successfully`,
      property: {
        _id: property._id,
        title: property.title,
        isApproved: property.isApproved
      }
    });
  } catch (error) {
    console.error('Error toggling property approval:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' });
    }

    // Delete user's properties if they are an agent
    if (user.role === 'agent') {
      await Property.deleteMany({ agent: user._id });
    }

    // Delete user's inquiries
    await Inquiry.deleteMany({ user: user._id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Delete related inquiries
    await Inquiry.deleteMany({ property: property._id });

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getProperties,
  getInquiries,
  toggleUserBlock,
  togglePropertyApproval,
  deleteUser,
  deleteProperty
};
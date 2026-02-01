const User = require('../models/User');
const Property = require('../models/Property');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const { cloudinary } = require('../config/cloudinary');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'wishlist',
      select: 'title price type category images location features',
    });

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (phone !== undefined) updateFields.phone = phone;
  if (bio !== undefined) updateFields.bio = bio;

  // Handle avatar upload if file is present
  if (req.file) {
    // Delete old avatar from Cloudinary if exists
    if (req.user.avatar && req.user.avatar.includes('cloudinary')) {
      const publicId = req.user.avatar.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
    updateFields.avatar = req.file.path;
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  
  if (req.query.role) {
    query.role = req.query.role;
  }
  
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  if (req.query.isBlocked !== undefined) {
    query.isBlocked = req.query.isBlocked === 'true';
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

/**
 * @desc    Get single user (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-refreshToken');

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Get user's properties if they're an agent
  let properties = [];
  if (user.role === 'agent') {
    properties = await Property.find({ agent: user._id })
      .select('title price type status isApproved createdAt')
      .sort({ createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    data: { user, properties },
  });
});

/**
 * @desc    Block/Unblock user (Admin only)
 * @route   PUT /api/users/:id/block
 * @access  Private/Admin
 */
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Prevent blocking admins
  if (user.role === 'admin') {
    throw new ApiError('Cannot block an admin user', 400);
  }

  // Prevent self-blocking
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError('Cannot block yourself', 400);
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
    data: { user },
  });
});

/**
 * @desc    Update user role (Admin only)
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'agent'].includes(role)) {
    throw new ApiError('Invalid role. Must be user or agent', 400);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Prevent changing admin role
  if (user.role === 'admin') {
    throw new ApiError('Cannot change admin role', 400);
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: { user },
  });
});

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError('User not found', 404);
  }

  // Prevent deleting admins
  if (user.role === 'admin') {
    throw new ApiError('Cannot delete an admin user', 400);
  }

  // Prevent self-deletion
  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError('Cannot delete yourself', 400);
  }

  // Delete user's properties if they're an agent
  if (user.role === 'agent') {
    await Property.deleteMany({ agent: user._id });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUser,
  toggleBlockUser,
  updateUserRole,
  deleteUser,
};

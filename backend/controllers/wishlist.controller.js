const User = require('../models/User');
const Property = require('../models/Property');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    match: { isApproved: true }, // Only show approved properties
    select: 'title price type category images location features status views createdAt',
    populate: {
      path: 'agent',
      select: 'name email phone avatar',
    },
  });

  // Filter out null values (unapproved or deleted properties)
  const wishlist = user.wishlist.filter((item) => item !== null);

  res.status(200).json({
    success: true,
    data: {
      wishlist,
      count: wishlist.length,
    },
  });
});

/**
 * @desc    Add property to wishlist
 * @route   POST /api/wishlist/:propertyId
 * @access  Private
 */
const addToWishlist = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  // Check if property exists and is approved
  const property = await Property.findOne({
    _id: propertyId,
    isApproved: true,
  });

  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Check if property is already in wishlist
  const user = await User.findById(req.user._id);
  
  if (user.wishlist.includes(propertyId)) {
    throw new ApiError('Property is already in your wishlist', 400);
  }

  // Add to wishlist
  user.wishlist.push(propertyId);
  await user.save();

  // Populate the added property
  await user.populate({
    path: 'wishlist',
    match: { isApproved: true },
    select: 'title price type category images location features',
  });

  res.status(200).json({
    success: true,
    message: 'Property added to wishlist',
    data: {
      wishlist: user.wishlist,
      count: user.wishlist.length,
    },
  });
});

/**
 * @desc    Remove property from wishlist
 * @route   DELETE /api/wishlist/:propertyId
 * @access  Private
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const user = await User.findById(req.user._id);

  // Check if property is in wishlist
  const index = user.wishlist.indexOf(propertyId);
  
  if (index === -1) {
    throw new ApiError('Property is not in your wishlist', 400);
  }

  // Remove from wishlist
  user.wishlist.splice(index, 1);
  await user.save();

  // Populate remaining wishlist
  await user.populate({
    path: 'wishlist',
    match: { isApproved: true },
    select: 'title price type category images location features',
  });

  res.status(200).json({
    success: true,
    message: 'Property removed from wishlist',
    data: {
      wishlist: user.wishlist,
      count: user.wishlist.length,
    },
  });
});

/**
 * @desc    Check if property is in wishlist
 * @route   GET /api/wishlist/check/:propertyId
 * @access  Private
 */
const checkWishlist = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const user = await User.findById(req.user._id);

  const isInWishlist = user.wishlist.includes(propertyId);

  res.status(200).json({
    success: true,
    data: {
      isInWishlist,
    },
  });
});

/**
 * @desc    Clear entire wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
const clearWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { wishlist: [] });

  res.status(200).json({
    success: true,
    message: 'Wishlist cleared successfully',
    data: {
      wishlist: [],
      count: 0,
    },
  });
});

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
};

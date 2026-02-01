const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Create new inquiry
 * @route   POST /api/inquiries
 * @access  Private
 */
const createInquiry = asyncHandler(async (req, res) => {
  const { propertyId, message, name, email, phone } = req.body;

  // Find property and verify it exists
  const property = await Property.findById(propertyId);
  
  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  if (!property.isApproved) {
    throw new ApiError('Cannot inquire about this property', 400);
  }

  // Prevent agent from inquiring about their own property
  if (req.user._id.toString() === property.agent.toString()) {
    throw new ApiError('You cannot inquire about your own property', 400);
  }

  // Check if user has already sent an inquiry for this property recently (within 24 hours)
  const existingInquiry = await Inquiry.findOne({
    user: req.user._id,
    property: propertyId,
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (existingInquiry) {
    throw new ApiError('You have already sent an inquiry for this property. Please wait 24 hours before sending another.', 400);
  }

  // Create inquiry
  const inquiry = await Inquiry.create({
    user: req.user._id,
    property: propertyId,
    agent: property.agent,
    name: name || req.user.name,
    email: email || req.user.email,
    phone,
    message,
  });

  // Populate inquiry data
  await inquiry.populate([
    { path: 'property', select: 'title images location price' },
    { path: 'agent', select: 'name email' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Inquiry sent successfully. The agent will contact you soon.',
    data: { inquiry },
  });
});

/**
 * @desc    Get all inquiries (for agent/admin)
 * @route   GET /api/inquiries
 * @access  Private/Agent/Admin
 */
const getInquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query based on user role
  let query = {};

  if (req.user.role === 'agent') {
    // Agents can only see their own inquiries
    query.agent = req.user._id;
  }
  // Admin can see all inquiries

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by read status
  if (req.query.isRead !== undefined) {
    query.isRead = req.query.isRead === 'true';
  }

  // Filter by property
  if (req.query.property) {
    query.property = req.query.property;
  }

  const total = await Inquiry.countDocuments(query);
  const inquiries = await Inquiry.find(query)
    .populate('user', 'name email phone avatar')
    .populate('property', 'title images location price')
    .populate('agent', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get unread count
  const unreadCount = await Inquiry.countDocuments({
    ...query,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    data: {
      inquiries,
      unreadCount,
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
 * @desc    Get single inquiry
 * @route   GET /api/inquiries/:id
 * @access  Private/Agent/Admin
 */
const getInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('user', 'name email phone avatar')
    .populate('property', 'title images location price type category')
    .populate('agent', 'name email phone');

  if (!inquiry) {
    throw new ApiError('Inquiry not found', 404);
  }

  // Check authorization
  if (req.user.role === 'agent' && inquiry.agent._id.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to view this inquiry', 403);
  }

  // Mark as read
  if (!inquiry.isRead) {
    inquiry.isRead = true;
    inquiry.status = 'read';
    await inquiry.save();
  }

  res.status(200).json({
    success: true,
    data: { inquiry },
  });
});

/**
 * @desc    Update inquiry status
 * @route   PUT /api/inquiries/:id
 * @access  Private/Agent/Admin
 */
const updateInquiry = asyncHandler(async (req, res) => {
  const { status, response } = req.body;

  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    throw new ApiError('Inquiry not found', 404);
  }

  // Check authorization
  if (req.user.role === 'agent' && inquiry.agent.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to update this inquiry', 403);
  }

  // Update fields
  if (status) {
    inquiry.status = status;
  }

  if (response) {
    inquiry.response = response;
    inquiry.respondedAt = new Date();
    inquiry.status = 'responded';
  }

  inquiry.isRead = true;
  await inquiry.save();

  await inquiry.populate([
    { path: 'user', select: 'name email phone' },
    { path: 'property', select: 'title images location price' },
  ]);

  res.status(200).json({
    success: true,
    message: 'Inquiry updated successfully',
    data: { inquiry },
  });
});

/**
 * @desc    Delete inquiry
 * @route   DELETE /api/inquiries/:id
 * @access  Private/Admin
 */
const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);

  if (!inquiry) {
    throw new ApiError('Inquiry not found', 404);
  }

  await inquiry.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Inquiry deleted successfully',
  });
});

/**
 * @desc    Get user's sent inquiries
 * @route   GET /api/inquiries/my-inquiries
 * @access  Private
 */
const getMyInquiries = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { user: req.user._id };

  const total = await Inquiry.countDocuments(query);
  const inquiries = await Inquiry.find(query)
    .populate('property', 'title images location price')
    .populate('agent', 'name email phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

module.exports = {
  createInquiry,
  getInquiries,
  getInquiry,
  updateInquiry,
  deleteInquiry,
  getMyInquiries,
};

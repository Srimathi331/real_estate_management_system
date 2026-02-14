const Property = require('../models/Property');
const User = require('../models/User');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');
const { cloudinary, getPublicIdFromUrl } = require('../config/cloudinary');

/**
 * @desc    Get all properties with filtering, sorting, and pagination
 * @route   GET /api/properties
 * @access  Public
 */
const getProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};

  // For public access, only show approved properties
  if (!req.user || req.user.role === 'user') {
    query.isApproved = true;
  }

  // Filter by type (buy/rent)
  if (req.query.type) {
    query.type = req.query.type;
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by price range
  if (req.query.priceMin || req.query.priceMax) {
    query.price = {};
    if (req.query.priceMin) {
      query.price.$gte = parseInt(req.query.priceMin, 10);
    }
    if (req.query.priceMax) {
      query.price.$lte = parseInt(req.query.priceMax, 10);
    }
  }

  // Filter by location (city or state)
  if (req.query.location) {
    query.$or = [
      { 'location.city': { $regex: req.query.location, $options: 'i' } },
      { 'location.state': { $regex: req.query.location, $options: 'i' } },
      { 'location.address': { $regex: req.query.location, $options: 'i' } },
    ];
  }

  // Filter by bedrooms
  if (req.query.bedrooms) {
    query['features.bedrooms'] = { $gte: parseInt(req.query.bedrooms, 10) };
  }

  // Filter by bathrooms
  if (req.query.bathrooms) {
    query['features.bathrooms'] = { $gte: parseInt(req.query.bathrooms, 10) };
  }

  // Filter by area range
  if (req.query.areaMin || req.query.areaMax) {
    query['features.area'] = {};
    if (req.query.areaMin) {
      query['features.area'].$gte = parseInt(req.query.areaMin, 10);
    }
    if (req.query.areaMax) {
      query['features.area'].$lte = parseInt(req.query.areaMax, 10);
    }
  }

  // Filter by amenities
  if (req.query.amenities) {
    const amenitiesArray = req.query.amenities.split(',');
    query.amenities = { $all: amenitiesArray };
  }

  // Filter by featured
  if (req.query.featured === 'true') {
    query.isFeatured = true;
  }

  // Filter by agent
  if (req.query.agent) {
    query.agent = req.query.agent;
  }

  // Search by keyword
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  
  switch (req.query.sort) {
    case 'price':
    case 'price_asc':
      sortOption = { price: 1 };
      break;
    case '-price':
    case 'price_desc':
      sortOption = { price: -1 };
      break;
    case 'createdAt':
    case 'oldest':
      sortOption = { createdAt: 1 };
      break;
    case '-createdAt':
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    case '-views':
    case 'popular':
      sortOption = { views: -1 };
      break;
    case 'title':
      sortOption = { title: 1 };
      break;
    case '-title':
      sortOption = { title: -1 };
      break;
  }

  // Execute query
  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .populate('agent', 'name email phone avatar')
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      properties,
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
 * @desc    Get single property by ID
 * @route   GET /api/properties/:id
 * @access  Public
 */
const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('agent', 'name email phone avatar bio');

  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Check if non-approved property is being accessed by unauthorized user
  if (!property.isApproved) {
    if (!req.user) {
      throw new ApiError('Property not found', 404);
    }
    if (req.user.role === 'user') {
      throw new ApiError('Property not found', 404);
    }
    if (req.user.role === 'agent' && property.agent._id.toString() !== req.user._id.toString()) {
      throw new ApiError('Property not found', 404);
    }
  }

  // Increment view count (only for approved properties viewed by non-owners)
  if (property.isApproved) {
    if (!req.user || req.user._id.toString() !== property.agent._id.toString()) {
      property.views += 1;
      await property.save();
    }
  }

  // Get similar properties
  const similarProperties = await Property.find({
    _id: { $ne: property._id },
    isApproved: true,
    type: property.type,
    category: property.category,
    'location.city': property.location.city,
  })
    .limit(4)
    .select('title price type category images location features');

  res.status(200).json({
    success: true,
    data: {
      property,
      similarProperties,
    },
  });
});

/**
 * @desc    Create new property
 * @route   POST /api/properties
 * @access  Private/Agent
 */
const createProperty = asyncHandler(async (req, res) => {
  console.log('Received form data:', req.body);
  console.log('Received files:', req.files);

  const {
    title,
    description,
    price,
    type,
    category,
    status,
  } = req.body;

  // Process uploaded images or external URLs
  const images = [];
  
  // Handle file uploads (if any)
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      // Handle both Cloudinary and local storage
      if (file.path) {
        // Cloudinary upload
        images.push({
          url: file.path,
          publicId: file.filename || file.originalname,
        });
      } else if (file.filename) {
        // Local storage upload - include full URL with correct path
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        images.push({
          url: `${baseUrl}/uploads/${file.filename}`,
          publicId: file.filename,
        });
      }
    }
  }
  
  // Handle external image URLs (for production deployment)
  if (req.body.imageUrls && req.body.imageUrls.length > 0) {
    const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
    urls.forEach((url, index) => {
      if (url && url.trim()) {
        images.push({
          url: url.trim(),
          publicId: `external-${Date.now()}-${index}`,
        });
      }
    });
  }

  // Build location object from individual fields
  const locationData = {
    address: req.body['location.address'],
    city: req.body['location.city'],
    state: req.body['location.state'],
    zipCode: req.body['location.zipCode'],
    country: req.body['location.country'] || 'India'
  };

  // Build features object from individual fields
  const featuresData = {
    bedrooms: parseInt(req.body['features.bedrooms']) || 0,
    bathrooms: parseInt(req.body['features.bathrooms']) || 0,
    area: parseFloat(req.body['features.area']) || 0,
    areaUnit: req.body['features.areaUnit'] || 'sqft',
    parking: parseInt(req.body['features.parking']) || 0,
    furnished: req.body['features.furnished'] || 'unfurnished',
    yearBuilt: parseInt(req.body['features.yearBuilt']) || new Date().getFullYear()
  };

  // Handle amenities array - they come as amenities[0], amenities[1], etc.
  const amenitiesData = [];
  Object.keys(req.body).forEach(key => {
    if (key.startsWith('amenities[')) {
      amenitiesData.push(req.body[key]);
    }
  });

  console.log('Processed location:', locationData);
  console.log('Processed features:', featuresData);
  console.log('Processed amenities:', amenitiesData);

  const property = await Property.create({
    title,
    description,
    price: parseFloat(price),
    type,
    category,
    status: status || 'available',
    location: locationData,
    features: featuresData,
    amenities: amenitiesData,
    images,
    agent: req.user._id,
    isApproved: req.user.role === 'admin', // Auto-approve if admin creates
  });

  await property.populate('agent', 'name email phone avatar');

  res.status(201).json({
    success: true,
    message: 'Property created successfully. Pending admin approval.',
    data: { property },
  });
});

/**
 * @desc    Update property
 * @route   PUT /api/properties/:id
 * @access  Private/Agent/Admin
 */
const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Check ownership (agent can only update their own properties)
  if (req.user.role === 'agent' && property.agent.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to update this property', 403);
  }

  const {
    title,
    description,
    price,
    type,
    category,
    status,
    location,
    features,
    amenities,
    removeImages,
    images,
  } = req.body;

  // Build update object
  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (price) updateData.price = price;
  if (type) updateData.type = type;
  if (category) updateData.category = category;
  if (status) updateData.status = status;
  if (location) updateData.location = typeof location === 'string' ? JSON.parse(location) : location;
  if (features) updateData.features = typeof features === 'string' ? JSON.parse(features) : features;
  if (amenities) updateData.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

  // Handle direct images array update (for URL-based images)
  if (images) {
    const imagesArray = typeof images === 'string' ? JSON.parse(images) : images;
    if (Array.isArray(imagesArray)) {
      property.images = imagesArray;
    }
  }

  // Handle image removal
  if (removeImages) {
    const imagesToRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
    
    // Delete images from Cloudinary
    for (const publicId of imagesToRemove) {
      await cloudinary.uploader.destroy(publicId).catch(console.error);
    }
    
    // Filter out removed images
    property.images = property.images.filter(
      (img) => !imagesToRemove.includes(img.publicId)
    );
  }

  // Handle new image uploads
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
    property.images = [...property.images, ...newImages];
  }

  // Update property
  property = await Property.findByIdAndUpdate(
    req.params.id,
    { ...updateData, images: property.images },
    { new: true, runValidators: true }
  ).populate('agent', 'name email phone avatar');

  res.status(200).json({
    success: true,
    message: 'Property updated successfully',
    data: { property },
  });
});

/**
 * @desc    Delete property
 * @route   DELETE /api/properties/:id
 * @access  Private/Agent/Admin
 */
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  // Check ownership
  if (req.user.role === 'agent' && property.agent.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to delete this property', 403);
  }

  // Delete images from Cloudinary
  for (const image of property.images) {
    if (image.publicId && image.publicId !== 'placeholder') {
      await cloudinary.uploader.destroy(image.publicId).catch(console.error);
    }
  }

  // Remove property from all wishlists
  await User.updateMany(
    { wishlist: property._id },
    { $pull: { wishlist: property._id } }
  );

  await property.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Property deleted successfully',
  });
});

/**
 * @desc    Approve/Reject property (Admin only)
 * @route   PUT /api/properties/:id/approve
 * @access  Private/Admin
 */
const approveProperty = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;

  const property = await Property.findByIdAndUpdate(
    req.params.id,
    { isApproved },
    { new: true }
  ).populate('agent', 'name email');

  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  res.status(200).json({
    success: true,
    message: isApproved ? 'Property approved successfully' : 'Property rejected',
    data: { property },
  });
});

/**
 * @desc    Toggle featured property (Admin only)
 * @route   PUT /api/properties/:id/featured
 * @access  Private/Admin
 */
const toggleFeatured = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError('Property not found', 404);
  }

  property.isFeatured = !property.isFeatured;
  await property.save();

  res.status(200).json({
    success: true,
    message: property.isFeatured ? 'Property marked as featured' : 'Property unmarked as featured',
    data: { property },
  });
});

/**
 * @desc    Get agent's properties
 * @route   GET /api/properties/my-properties
 * @access  Private/Agent
 */
const getMyProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { agent: req.user._id };

  if (req.query.isApproved !== undefined) {
    query.isApproved = req.query.isApproved === 'true';
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: {
      properties,
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
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
  toggleFeatured,
  getMyProperties,
};

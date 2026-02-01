const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError, asyncHandler } = require('./errorHandler');

/**
 * Protect routes - Verify JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // Make sure token exists
  if (!token) {
    throw new ApiError('Not authorized to access this route. Please log in.', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError('User not found', 404);
    }

    // Check if user is blocked
    if (user.isBlocked) {
      throw new ApiError('Your account has been blocked. Please contact support.', 403);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Invalid token. Please log in again.', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token expired. Please log in again.', 401);
    }
    throw error;
  }
});

/**
 * Optional Auth - Attach user if token exists, but don't require it
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user && !user.isBlocked) {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, continue without user
    }
  }

  next();
});

/**
 * Authorize by role - Grant access to specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError('Not authorized to access this route', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        `Role '${req.user.role}' is not authorized to access this route`,
        403
      );
    }

    next();
  };
};

/**
 * Check if user owns the resource or is admin
 */
const checkOwnership = (model) => asyncHandler(async (req, res, next) => {
  const resource = await model.findById(req.params.id);

  if (!resource) {
    throw new ApiError('Resource not found', 404);
  }

  // Admin can access any resource
  if (req.user.role === 'admin') {
    req.resource = resource;
    return next();
  }

  // Check ownership - handle different field names
  const ownerId = resource.agent || resource.user || resource.owner;
  
  if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError('Not authorized to modify this resource', 403);
  }

  req.resource = resource;
  next();
});

module.exports = {
  protect,
  optionalAuth,
  authorize,
  checkOwnership,
};

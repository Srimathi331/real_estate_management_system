const User = require('../models/User');
const { ApiError, asyncHandler } = require('../middleware/errorHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  try {
    console.log('Registration attempt:', { 
      name: req.body.name, 
      email: req.body.email, 
      role: req.body.role 
    });

    const { name, email, password, role } = req.body;

    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      throw new ApiError('User with this email already exists', 400);
    }

    // Create user (role defaults to 'user', admin can only be created by seeder/direct DB)
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'agent' ? 'agent' : 'user', // Only allow user or agent during registration
    });

    console.log('User created successfully:', user._id);

    // Generate tokens
    console.log('Generating tokens...');
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    console.log('Saving refresh token...');
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    console.log('Registration completed successfully');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Check if user is blocked
  if (user.isBlocked) {
    throw new ApiError('Your account has been blocked. Please contact support.', 403);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookies
  setTokenCookies(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    },
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // Clear refresh token from database
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  }

  // Clear cookies
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.cookies || req.body;

  if (!token) {
    throw new ApiError('Refresh token not found', 401);
  }

  // Verify refresh token
  const jwt = require('jsonwebtoken');
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ApiError('Invalid or expired refresh token', 401);
  }

  // Find user with this refresh token
  const user = await User.findOne({
    _id: decoded.id,
    refreshToken: token,
  });

  if (!user) {
    throw new ApiError('Invalid refresh token', 401);
  }

  if (user.isBlocked) {
    throw new ApiError('Your account has been blocked', 403);
  }

  // Generate new tokens
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  // Update refresh token in database
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookies
  setTokenCookies(res, newAccessToken, newRefreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: newAccessToken,
    },
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    success: true,
    data: { user },
  });
});

/**
 * Helper function to set token cookies
 */
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Access token cookie (15 minutes)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token cookie (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
};

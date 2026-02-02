const { body, param, query, validationResult } = require('express-validator');
const { ApiError } = require('./errorHandler');

/**
 * Validation Result Handler
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
    });
  }
  next();
};

/**
 * Auth Validators
 */
const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('role')
    .optional()
    .isIn(['user', 'agent'])
    .withMessage('Role must be either user or agent'),
  validate,
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

/**
 * Property Validators
 */
const propertyValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value >= 0)
    .withMessage('Price cannot be negative'),
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['buy', 'rent'])
    .withMessage('Type must be either buy or rent'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial', 'office'])
    .withMessage('Invalid category'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('features.bedrooms')
    .notEmpty()
    .withMessage('Number of bedrooms is required')
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative number'),
  body('features.bathrooms')
    .notEmpty()
    .withMessage('Number of bathrooms is required')
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a non-negative number'),
  body('features.area')
    .notEmpty()
    .withMessage('Area is required')
    .isNumeric()
    .withMessage('Area must be a number')
    .custom((value) => value >= 1)
    .withMessage('Area must be at least 1'),
  body('amenities')
    .optional()
    .isArray()
    .withMessage('Amenities must be an array'),
  validate,
];

const propertyUpdateValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value >= 0)
    .withMessage('Price cannot be negative'),
  body('type')
    .optional()
    .isIn(['buy', 'rent'])
    .withMessage('Type must be either buy or rent'),
  body('category')
    .optional()
    .isIn(['apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial', 'office'])
    .withMessage('Invalid category'),
  validate,
];

/**
 * Inquiry Validator
 */
const inquiryValidator = [
  body('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .isMongoId()
    .withMessage('Invalid property ID'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .trim(),
  validate,
];

/**
 * Profile Update Validator
 */
const profileUpdateValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim(),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  validate,
];

/**
 * MongoDB ID Validator
 */
const mongoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate,
];

/**
 * Property Query Validator
 */
const propertyQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('priceMin')
    .optional()
    .isNumeric()
    .withMessage('Minimum price must be a number'),
  query('priceMax')
    .optional()
    .isNumeric()
    .withMessage('Maximum price must be a number'),
  query('type')
    .optional()
    .isIn(['buy', 'rent'])
    .withMessage('Type must be either buy or rent'),
  query('category')
    .optional()
    .isIn(['apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial', 'office'])
    .withMessage('Invalid category'),
  query('sort')
    .optional()
    .custom((value) => {
      const validSorts = [
        'price', '-price', 'createdAt', '-createdAt', 'updatedAt', '-updatedAt',
        'title', '-title', 'area', '-area', 'bedrooms', '-bedrooms',
        'price_asc', 'price_desc', 'newest', 'oldest', 'popular'
      ];
      return validSorts.includes(value);
    })
    .withMessage('Invalid sort option'),
  validate,
];

module.exports = {
  validate,
  registerValidator,
  loginValidator,
  propertyValidator,
  propertyUpdateValidator,
  inquiryValidator,
  profileUpdateValidator,
  mongoIdValidator,
  propertyQueryValidator,
};

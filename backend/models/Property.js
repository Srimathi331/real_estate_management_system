const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: ['buy', 'rent'],
        message: 'Type must be either buy or rent',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['apartment', 'house', 'villa', 'condo', 'townhouse', 'land', 'commercial', 'office'],
        message: 'Invalid category',
      },
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'pending'],
      default: 'available',
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
        default: 'India',
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    features: {
      bedrooms: {
        type: Number,
        required: [true, 'Number of bedrooms is required'],
        min: [0, 'Bedrooms cannot be negative'],
      },
      bathrooms: {
        type: Number,
        required: [true, 'Number of bathrooms is required'],
        min: [0, 'Bathrooms cannot be negative'],
      },
      area: {
        type: Number,
        required: [true, 'Area is required'],
        min: [1, 'Area must be at least 1 sq ft'],
      },
      areaUnit: {
        type: String,
        enum: ['sqft', 'sqm'],
        default: 'sqft',
      },
      parking: {
        type: Number,
        default: 0,
      },
      furnished: {
        type: String,
        enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
        default: 'unfurnished',
      },
      yearBuilt: {
        type: Number,
      },
    },
    amenities: [
      {
        type: String,
        enum: [
          'swimming-pool',
          'gym',
          'garden',
          'parking',
          'security',
          'elevator',
          'air-conditioning',
          'balcony',
          'fireplace',
          'laundry',
          'storage',
          'pet-friendly',
          'wheelchair-accessible',
          'smart-home',
          'solar-panels',
          'cctv',
          'intercom',
          'club-house',
          'play-area',
          'power-backup',
        ],
      },
    ],
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
        },
        caption: {
          type: String,
        },
      },
    ],
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent is required'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiryCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better search performance
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text' });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ 'location.state': 1 });
propertySchema.index({ agent: 1 });
propertySchema.index({ isApproved: 1 });
propertySchema.index({ createdAt: -1 });

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function () {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(this.price);
});

// Virtual for inquiries
propertySchema.virtual('inquiries', {
  ref: 'Inquiry',
  localField: '_id',
  foreignField: 'property',
});

// Pre-save middleware to ensure at least one image
propertySchema.pre('save', function (next) {
  if (this.images.length === 0) {
    // Add a placeholder image if no images provided
    this.images.push({
      url: 'https://res.cloudinary.com/demo/image/upload/v1/real-estate/placeholder.jpg',
      publicId: 'placeholder',
      caption: 'Property Image',
    });
  }
  next();
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;

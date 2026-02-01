const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'read', 'responded', 'closed'],
      default: 'pending',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    response: {
      type: String,
      maxlength: [1000, 'Response cannot exceed 1000 characters'],
    },
    respondedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
inquirySchema.index({ user: 1 });
inquirySchema.index({ property: 1 });
inquirySchema.index({ agent: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });

// Update property inquiry count after saving
inquirySchema.post('save', async function () {
  const Property = mongoose.model('Property');
  const count = await this.constructor.countDocuments({ property: this.property });
  await Property.findByIdAndUpdate(this.property, { inquiryCount: count });
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;

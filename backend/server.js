const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();   

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars);
  console.error('Please set these environment variables in your deployment platform');
  process.exit(1);
}

console.log('✅ All required environment variables are set');   

// Import database connection
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const propertyRoutes = require('./routes/property.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const inquiryRoutes = require('./routes/inquiry.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const adminRoutes = require('./routes/admin');

// Import error handler
const { errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  if (process.env.NODE_ENV !== 'development') {
    process.exit(1);
  }
});

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Rate limiting (disabled for development)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: { message: 'Too many requests, please try again later.' },
// });
// app.use('/api', limiter);

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Cookie Parser
app.use(cookieParser());

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Real Estate API is running',
    timestamp: new Date().toISOString(),
  });
});

// Test endpoint to check and fix image URLs
app.get('/api/fix-images', async (req, res) => {
  try {
    const Property = require('./models/Property');
    const properties = await Property.find();
    
    let fixedCount = 0;
    
    // Fix image URLs for existing properties
    for (let property of properties) {
      let updated = false;
      for (let image of property.images) {
        if (image.url && image.url.includes('uploads\\uploads\\')) {
          // Fix double uploads with backslashes
          image.url = image.url.replace('uploads\\uploads\\', 'uploads/');
          updated = true;
          fixedCount++;
        } else if (image.url && image.url.includes('/uploads/uploads\\')) {
          // Fix double uploads with mixed slashes
          image.url = image.url.replace('/uploads/uploads\\', '/uploads/');
          updated = true;
          fixedCount++;
        }
      }
      if (updated) {
        await property.save();
      }
    }
    
    res.json({
      success: true,
      message: `Fixed ${fixedCount} image URLs`,
      fixedCount: fixedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🏠 Real Estate Management System API                 ║
  ║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  ║
  ║   🚀 Server running on port ${PORT}                      ║
  ║   📝 Environment: ${process.env.NODE_ENV || 'development'}                       ║
  ║   🔗 API URL: http://localhost:${PORT}/api               ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  // Close server & exit process
  process.exit(1);
});

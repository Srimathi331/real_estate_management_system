const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection options with shorter timeouts for faster failure detection
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds - faster timeout
      socketTimeoutMS: 10000, // 10 seconds
      bufferCommands: false, // Disable buffering to fail fast
      maxPoolSize: 10,
      connectTimeoutMS: 5000, // 5 seconds connection timeout
    };

    console.log('🔗 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes('IP')) {
      console.log('💡 IP Whitelist Issue: Please add your IP to MongoDB Atlas Network Access');
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Select your project');
      console.log('   3. Go to Network Access');
      console.log('   4. Click "Add IP Address"');
      console.log('   5. Choose "Allow Access from Anywhere" for testing');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Authentication Issue: Please check your MongoDB credentials');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('timeout')) {
      console.log('💡 Network Issue: MongoDB Atlas is not reachable from your network');
      console.log('   This could be due to:');
      console.log('   - ISP blocking MongoDB Atlas ports');
      console.log('   - Corporate firewall restrictions');
      console.log('   - Network connectivity issues');
    }
    
    // Don't exit in development, allow server to start without DB
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Starting server without database connection (development mode)');
      console.log('📝 API endpoints will return mock data until MongoDB is available');
      return null;
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

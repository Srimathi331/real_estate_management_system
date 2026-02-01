/**
 * Test MongoDB Atlas Connection
 * Run this to verify your Atlas connection works before starting the server
 * 
 * Usage: node test-connection.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log(`📡 Connecting to: ${process.env.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`🏠 Database: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    console.log('');
    console.log('🚀 You can now start your server with: npm run dev');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error(`   Error: ${error.message}`);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check your connection string in .env file');
    console.log('   2. Verify username/password are correct');
    console.log('   3. Ensure IP address is whitelisted in Atlas');
    console.log('   4. Check if cluster is running (not paused)');
  }
  
  process.exit();
};

testConnection();
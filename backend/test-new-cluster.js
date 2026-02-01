const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testNewCluster = async () => {
  try {
    console.log('🇮🇳 Testing new Mumbai MongoDB Atlas cluster...');
    console.log('URI (masked):', process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    
    console.log('🎉 SUCCESS! New Mumbai cluster connected!');
    console.log('✅ Host:', conn.connection.host);
    console.log('✅ Database:', conn.connection.name);
    console.log('✅ Ready State:', conn.connection.readyState);
    
    // Test basic operations
    console.log('🔍 Testing database operations...');
    const admin = mongoose.connection.db.admin();
    const pingResult = await admin.ping();
    console.log('📡 Ping result:', pingResult);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Collections found:', collections.length);
    
    await mongoose.disconnect();
    console.log('✅ Mumbai cluster test completed successfully!');
    console.log('🚀 Your backend server should now connect perfectly!');
    
  } catch (error) {
    console.error('❌ Mumbai cluster connection failed:', error.message);
    
    if (error.message.includes('authentication')) {
      console.log('💡 Check credentials: realestate_user / Realestate');
    } else if (error.message.includes('IP')) {
      console.log('💡 Check Network Access whitelist');
    } else {
      console.log('💡 Network connectivity issue');
    }
  }
  
  process.exit();
};

testNewCluster();
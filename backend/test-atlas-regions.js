const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testAtlasConnection = async () => {
  try {
    console.log('🌍 Testing MongoDB Atlas connection with different settings...');
    
    // Try with different connection parameters
    const connectionOptions = [
      {
        name: 'Standard Connection',
        uri: process.env.MONGODB_URI,
        options: { serverSelectionTimeoutMS: 10000 }
      },
      {
        name: 'With SSL Disabled',
        uri: process.env.MONGODB_URI + '&ssl=false',
        options: { serverSelectionTimeoutMS: 10000 }
      },
      
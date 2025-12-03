require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Testing MongoDB connection...');
console.log('📍 URI:', MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
console.log('⏳ Connecting...\n');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // 10 second timeout
})
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB Atlas');
    console.log('📊 Connection state:', mongoose.connection.readyState);
    console.log('🗄️  Database name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ FAILED! Could not connect to MongoDB Atlas');
    console.log('\n🔍 Error details:');
    console.log('   Message:', error.message);
    
    if (error.message.includes('IP')) {
      console.log('\n💡 Solution:');
      console.log('   1. Go to MongoDB Atlas → Network Access');
      console.log('   2. Add IP address: 136.226.231.77');
      console.log('   3. Or click "Allow Access from Anywhere" (0.0.0.0/0)');
      console.log('   4. Wait 2-3 minutes for changes to apply');
    }
    
    if (error.message.includes('authentication')) {
      console.log('\n💡 Solution:');
      console.log('   1. Check your username and password in .env file');
      console.log('   2. Make sure password special characters are URL-encoded');
    }
    
    process.exit(1);
  });

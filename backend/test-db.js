const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB connection
async function testConnection() {
    try {
        console.log('🔗 Testing MongoDB connection...');
        console.log('📝 MongoDB URI:', process.env.MONGODB_URI?.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connection successful!');
        console.log(`📍 Connected to: ${conn.connection.host}`);
        console.log(`📂 Database: ${conn.connection.name}`);

        // Test a simple operation
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`📚 Collections found: ${collections.length}`);

        await mongoose.disconnect();
        console.log('🔌 Disconnected successfully');
        process.exit(0);

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);

        if (error.message.includes('authentication failed')) {
            console.log('🔑 Authentication issue - check your MongoDB username/password');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('🌐 Connection refused - check your network or MongoDB service');
        } else if (error.message.includes('timeout')) {
            console.log('⏰ Connection timeout - check your internet connection');
        }

        process.exit(1);
    }
}

testConnection();

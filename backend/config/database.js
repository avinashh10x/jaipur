const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/profiledb';
        console.log('Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📂 Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 MongoDB is not running. Please:');
            console.log('   1. Install MongoDB locally, OR');
            console.log('   2. Set MONGODB_URI environment variable to your MongoDB Atlas URL');
        }

        // Don't exit the process in production, just log the error
        if (process.env.NODE_ENV !== 'production') {
            console.log('🔄 Retrying connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        }
    }
};

module.exports = connectDB;

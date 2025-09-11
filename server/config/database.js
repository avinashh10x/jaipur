const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // testing my server 
        const mongoURI ="mongodb+srv://test:test123@cluster0.gdcm9.mongodb.net/profile_manager?retryWrites=true&w=majority&appName=Cluster0";
        console.log('🔗 Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
};

module.exports = connectDB;

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/profiledb';
        console.log('🔗 Attempting to connect to MongoDB...');
        console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

        // Set connection options for better reliability
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        const conn = await mongoose.connect(mongoURI, options);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);

        return conn;

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 MongoDB connection refused. Possible causes:');
            console.log('   1. MongoDB Atlas credentials are incorrect');
            console.log('   2. IP address is not whitelisted in MongoDB Atlas');
            console.log('   3. Network connectivity issues');
        }

        if (error.message.includes('authentication failed')) {
            console.log('💡 Authentication failed. Check your MongoDB credentials');
        }

        // In production, don't retry - let the deployment fail fast
        if (process.env.NODE_ENV === 'production') {
            console.error('🚨 Production deployment failed due to database connection');
            throw error; // This will cause the deployment to fail, which is what we want
        } else {
            console.log('🔄 Retrying connection in 5 seconds...');
            setTimeout(connectDB, 5000);
        }
    }
};

module.exports = connectDB;

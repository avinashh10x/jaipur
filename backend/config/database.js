const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/profiledb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        console.log('MongoDB might not be running. Please start MongoDB service.');
        // Don't exit the process in production, just log the error
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;

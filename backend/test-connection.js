const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Testing MongoDB connection...');
        console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connection successful!');
        console.log('Host:', conn.connection.host);
        console.log('Database:', conn.connection.name);

        await mongoose.disconnect();
        console.log('✅ Disconnected');
        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./config/database');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Start server first, then try to connect to MongoDB
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);

    // Try to connect to MongoDB after server starts
    connectDB();
});

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://jaipur-frontend.vercel.app',
        // Add your actual frontend domain here
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/', profileRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'Profile Manager API',
        version: '1.0.0',
        endpoints: {
            'POST /profile': 'Create or update profile',
            'GET /profile': 'Get profile',
            'GET /projects?skill=<skill>': 'Get projects by skill',
            'GET /skills/top': 'Get top skills',
            'GET /search?q=<query>': 'Search profiles and projects',
            'GET /health': 'Health check'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

module.exports = app;

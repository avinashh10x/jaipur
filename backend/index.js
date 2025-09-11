const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const profileRoutes = require('./routes/profileRoutes');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check route (should be available even if DB is down)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Profile Manager API is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0'
    });
});

connectDB()

// API routes
app.use('/api', profileRoutes);
app.use('/', profileRoutes); // Fallback for routes without /api prefix

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Profile Manager API',
        status: 'running',
        endpoints: {
            health: '/health',
            profile: '/api/profile',
            search: '/api/search',
            skills: '/api/skills/top',
            projects: '/api/projects'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Server startup
const PORT = process.env.PORT || 5000;

app.listen((req,res)=>{
    console.log(`✅ Server running on port ${PORT}`)
})


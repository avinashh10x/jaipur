const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Middleware
app.use(cors(
    origin='*',
));        
             // default CORS, allow all origins
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} • ${req.method} ${req.path}`);
  next();
});

// Health-check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Profile Manager API is running',
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Connect DB & use routes
connectDB();
app.use('/api', profileRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Profile Manager API',
    endpoints: {
      health: '/health',
      profile: '/api/profile',
      // more endpoints if any...
    }
  });
});




// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

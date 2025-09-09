const express = require('express');
const router = express.Router();
const {
    createOrUpdateProfile,
    getProfile,
    getProjectsBySkill,
    getTopSkills,
    searchProfiles,
    healthCheck
} = require('../controllers/profileController');

// Profile routes
router.post('/profile', createOrUpdateProfile);
router.get('/profile', getProfile);

// Project routes
router.get('/projects', getProjectsBySkill);

// Skills routes
router.get('/skills/top', getTopSkills);

// Search route
router.get('/search', searchProfiles);

// Health check route
router.get('/health', healthCheck);

module.exports = router;

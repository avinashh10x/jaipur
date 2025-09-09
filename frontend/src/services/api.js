import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const profileAPI = {
    // Get profile data
    getProfile: (email = null) => {
        const params = email ? { email } : {};
        return api.get('/profile', { params });
    },

    // Create or update profile
    createOrUpdateProfile: (profileData) => {
        return api.post('/profile', profileData);
    },

    // Get projects by skill
    getProjectsBySkill: (skill) => {
        return api.get('/projects', { params: { skill } });
    },

    // Get top skills
    getTopSkills: () => {
        return api.get('/skills/top');
    },

    // Search profiles and projects
    searchProfiles: (query) => {
        return api.get('/search', { params: { q: query } });
    },

    // Health check
    healthCheck: () => {
        return api.get('/health');
    }
};

export default api;

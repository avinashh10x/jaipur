import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://jaipur-3.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
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
    searchProfiles: async (query) => {
        console.log('🔍 Searching for:', query);
        try {
            const response = await api.get('/search', { params: { q: query.trim() } });
            console.log('✅ Search Response:', response.data);
            console.log('📊 Number of results:', response.data.length);
            return response;
        } catch (error) {
            console.error('❌ Search Error:', error);
            throw error;
        }
    },

    // Health check
    healthCheck: () => {
        return api.get('/health');
    }
};

export default api;

import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000';
const API_BASE_URL = 'https://jaipur-9nr1.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        console.log('Params:', config.params);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

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
        const encodedQuery = encodeURIComponent(query.trim());
        console.log('Searching for:', query, 'Encoded:', encodedQuery);
        return api.get(`/search?q=${encodedQuery}`);
    },

    // Health check
    healthCheck: () => {
        return api.get('/health');
    }
};

export default api;

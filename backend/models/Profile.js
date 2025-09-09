const mongoose = require('mongoose');

// Education Schema
const educationSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    cgpa: {
        type: String,
        default: ''
    },
    start_year: {
        type: Number,
        required: true
    },
    end_year: {
        type: Number,
        required: true
    },
    // Keep backward compatibility
    year: {
        type: Number,
        required: false
    }
});

// Project Schema
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    timeline: {
        type: String,
        default: ''
    }
});

// Experience Schema
const experienceSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    }
});

// Links Schema
const linksSchema = new mongoose.Schema({
    github: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    portfolio: {
        type: String,
        default: ''
    }
});

// Main Profile Schema
const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        default: ''
    },
    portfolio: {
        type: String,
        default: ''
    },
    education: [educationSchema],
    skills: {
        type: [String],
        required: true
    },
    projects: [projectSchema],
    experience: [experienceSchema],
    languages: {
        type: [String],
        default: []
    },
    links: linksSchema
}, {
    timestamps: true
});

// Create indexes for better search performance
profileSchema.index({ name: 'text', 'projects.title': 'text', 'projects.description': 'text' });

module.exports = mongoose.model('Profile', profileSchema);

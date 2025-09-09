const Profile = require('../models/Profile');

// Create or Update Profile
const createOrUpdateProfile = async (req, res) => {
    try {
        const { name, email, phone, portfolio, education, skills, projects, experience, languages, links } = req.body;

        // Check if profile with this email exists
        let profile = await Profile.findOne({ email });

        if (profile) {
            // Update existing profile
            profile.name = name;
            profile.phone = phone || profile.phone;
            profile.portfolio = portfolio || profile.portfolio;
            profile.education = education;
            profile.skills = skills;
            profile.projects = projects;
            profile.experience = experience || profile.experience;
            profile.languages = languages || profile.languages;
            profile.links = links;
            await profile.save();
        } else {
            // Create new profile
            profile = new Profile({
                name,
                email,
                phone,
                portfolio,
                education,
                skills,
                projects,
                experience,
                languages,
                links
            });
            await profile.save();
        }

        res.status(200).json({
            message: 'Profile created/updated successfully',
            id: profile._id
        });
    } catch (error) {
        console.error('Error creating/updating profile:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Profile
const getProfile = async (req, res) => {
    try {
        // Get email from query params, or get the most recent profile
        const { email } = req.query;

        let profile;
        if (email) {
            profile = await Profile.findOne({ email });
        } else {
            profile = await Profile.findOne().sort({ updatedAt: -1 });
        }

        if (!profile) {
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Query Projects by Skill
const getProjectsBySkill = async (req, res) => {
    try {
        const { skill } = req.query;

        if (!skill) {
            return res.status(400).json({
                message: 'Skill parameter is required'
            });
        }

        const profiles = await Profile.find({
            'projects.skills': { $regex: skill, $options: 'i' }
        });

        let projects = [];
        profiles.forEach(profile => {
            profile.projects.forEach(project => {
                if (project.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
                    projects.push({
                        title: project.title,
                        skills: project.skills,
                        description: project.description
                    });
                }
            });
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects by skill:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Top Skills
const getTopSkills = async (req, res) => {
    try {
        const profiles = await Profile.find();

        const skillCount = {};

        profiles.forEach(profile => {
            profile.projects.forEach(project => {
                project.skills.forEach(skill => {
                    const normalizedSkill = skill.toLowerCase();
                    skillCount[normalizedSkill] = (skillCount[normalizedSkill] || 0) + 1;
                });
            });
        });

        // Sort skills by frequency and get top ones
        const topSkills = Object.entries(skillCount)
            .sort(([, a], [, b]) => b - a)
            .map(([skill]) => skill)
            .slice(0, 10); // Get top 10 skills

        res.status(200).json(topSkills);
    } catch (error) {
        console.error('Error fetching top skills:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Search (Keyword in Profile/Projects)
const searchProfiles = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: 'Search query parameter is required'
            });
        }

        const searchRegex = new RegExp(q, 'i');

        const profiles = await Profile.find({
            $or: [
                { name: searchRegex },
                { 'education.degree': searchRegex },
                { 'education.college': searchRegex },
                { 'projects.title': searchRegex },
                { 'projects.description': searchRegex },
                { 'experience.role': searchRegex },
                { 'experience.company': searchRegex },
                { 'experience.description': searchRegex }
            ]
        });

        let results = [];

        profiles.forEach(profile => {
            // Check name match
            if (profile.name.toLowerCase().includes(q.toLowerCase())) {
                results.push({
                    type: 'profile',
                    name: profile.name,
                    email: profile.email
                });
            }

            // Check education matches
            profile.education.forEach(edu => {
                if (edu.degree.toLowerCase().includes(q.toLowerCase()) ||
                    edu.college.toLowerCase().includes(q.toLowerCase())) {
                    results.push({
                        type: 'education',
                        degree: edu.degree,
                        college: edu.college,
                        cgpa: edu.cgpa,
                        start_year: edu.start_year,
                        end_year: edu.end_year,
                        year: edu.year // backward compatibility
                    });
                }
            });

            // Check experience matches
            if (profile.experience) {
                profile.experience.forEach(exp => {
                    if (exp.role.toLowerCase().includes(q.toLowerCase()) ||
                        exp.company.toLowerCase().includes(q.toLowerCase()) ||
                        exp.description.toLowerCase().includes(q.toLowerCase())) {
                        results.push({
                            type: 'experience',
                            role: exp.role,
                            company: exp.company,
                            timeline: exp.timeline,
                            description: exp.description
                        });
                    }
                });
            }

            // Check project matches
            profile.projects.forEach(project => {
                if (project.title.toLowerCase().includes(q.toLowerCase()) ||
                    project.description.toLowerCase().includes(q.toLowerCase())) {
                    results.push({
                        type: 'project',
                        title: project.title,
                        description: project.description,
                        skills: project.skills,
                        timeline: project.timeline
                    });
                }
            });
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error searching profiles:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Health Check
const healthCheck = (req, res) => {
    const uptime = Math.floor(process.uptime());
    res.status(200).json({
        status: 'ok',
        uptime: `${uptime}s`
    });
};

module.exports = {
    createOrUpdateProfile,
    getProfile,
    getProjectsBySkill,
    getTopSkills,
    searchProfiles,
    healthCheck
};


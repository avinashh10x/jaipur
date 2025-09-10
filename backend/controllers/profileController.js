const Profile = require('../models/Profile');

// Create or Update Profile
const createOrUpdateProfile = async (req, res) => {
    try {
        const { name, email, phone, portfolio, education, skills, projects, experience, languages, links } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                message: 'Name and email are required fields'
            });
        }

        // For single-profile system: Find existing profile or create new one
        // We'll always update the most recent profile regardless of email changes
        let profile = await Profile.findOne().sort({ updatedAt: -1 });

        if (profile) {
            // Update existing profile - update all provided fields
            profile.name = name;
            profile.email = email;
            if (phone !== undefined) profile.phone = phone;
            if (portfolio !== undefined) profile.portfolio = portfolio;
            if (education !== undefined) profile.education = education;
            if (skills !== undefined) profile.skills = skills;
            if (projects !== undefined) profile.projects = projects;
            if (experience !== undefined) profile.experience = experience;
            if (languages !== undefined) profile.languages = languages;
            if (links !== undefined) profile.links = links;

            await profile.save();

            res.status(200).json({
                message: 'Profile updated successfully',
                id: profile._id,
                profile: profile
            });
        } else {
            // Create new profile (this should only happen on first run)
            profile = new Profile({
                name,
                email,
                phone: phone || '',
                portfolio: portfolio || '',
                education: education || [],
                skills: skills || [],
                projects: projects || [],
                experience: experience || [],
                languages: languages || [],
                links: links || {}
            });
            await profile.save();

            res.status(201).json({
                message: 'Profile created successfully',
                id: profile._id,
                profile: profile
            });
        }
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

        // If no profile exists, create and return default profile
        if (!profile) {
            const defaultProfile = {
                name: "Avinash Kumar",
                email: "thissideavinash@gmail.com",
                phone: "+91 6239378916",
                portfolio: "https://myportfolio-delta-vert.vercel.app",
                education: [
                    {
                        degree: "B.Tech CSE",
                        college: "CT Institute of Engineering, Shahpur (Punjab)",
                        cgpa: "8 CGPA",
                        start_year: 2021,
                        end_year: 2025
                    }
                ],
                skills: [
                    "React.js", "React Native", "HTML5", "CSS3", "JavaScript",
                    "Node.js", "Express.js", "MongoDB", "SQL", "LangChain",
                    "OpenAI/LLM Agents", "Prompt Engineering", "Docker",
                    "Swagger API", "RESTful APIs", "Postman", "Git", "GitHub",
                    "Appwrite", "Wix", "WordPress", "Tailwind CSS",
                    "Material-UI", "Bootstrap", "Chakra UI", "Python"
                ],
                projects: [
                    {
                        title: "Inventory Store Management System",
                        description: "Web app for retailers/wholesalers to manage products with unlimited room creation and advanced search. Features include admin dashboard with real-time graphs, action history, and optimized performance using Appwrite indexing and lazy loading.",
                        timeline: "Jan 2024 – Mar 2025",
                        skills: ["React.js", "Node.js", "MongoDB", "Appwrite", "Chakra UI"]
                    },
                    {
                        title: "Portfolio Website",
                        description: "Personal portfolio website showcasing projects and skills with responsive design and modern UI/UX.",
                        timeline: "Dec 2023 – Jan 2024",
                        skills: ["React.js", "CSS3", "HTML5", "JavaScript"]
                    }
                ],
                experience: [
                    {
                        role: "Full Stack Developer",
                        company: "Self-employed",
                        timeline: "2023 - Present",
                        description: "Developing web applications using modern technologies like React, Node.js, and MongoDB."
                    }
                ],
                languages: ["English", "Hindi"],
                links: {
                    github: "https://github.com/avinashh10x",
                    linkedin: "https://linkedin.com/in/avinash-kumar",
                    portfolio: "https://myportfolio-delta-vert.vercel.app"
                }
            };

            // Create the default profile
            profile = new Profile(defaultProfile);
            await profile.save();
            console.log('Default profile created');
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

        if (!q || q.trim() === '') {
            return res.status(400).json({
                message: 'Search query parameter is required'
            });
        }

        const searchTerm = q.trim();
        const searchRegex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        console.log(`Search query: "${searchTerm}"`);

        const profiles = await Profile.find({
            $or: [
                { name: searchRegex },
                { 'education.degree': searchRegex },
                { 'education.college': searchRegex },
                { 'projects.title': searchRegex },
                { 'projects.description': searchRegex },
                { 'experience.role': searchRegex },
                { 'experience.company': searchRegex },
                { 'experience.description': searchRegex },
                { skills: searchRegex }
            ]
        });

        console.log(`Found ${profiles.length} profiles matching search`);

        let results = [];

        profiles.forEach(profile => {
            // Check name match
            if (profile.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({
                    type: 'profile',
                    name: profile.name,
                    email: profile.email
                });
            }

            // Check skills match
            if (profile.skills && profile.skills.some(skill =>
                skill.toLowerCase().includes(searchTerm.toLowerCase()))) {
                results.push({
                    type: 'skill',
                    skill: profile.skills.find(skill =>
                        skill.toLowerCase().includes(searchTerm.toLowerCase())),
                    name: profile.name
                });
            }

            // Check education matches
            profile.education.forEach(edu => {
                if (edu.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    edu.college.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push({
                        type: 'education',
                        degree: edu.degree,
                        college: edu.college,
                        cgpa: edu.cgpa,
                        start_year: edu.start_year,
                        end_year: edu.end_year,
                        name: profile.name
                    });
                }
            });

            // Check experience matches
            if (profile.experience) {
                profile.experience.forEach(exp => {
                    if (exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        exp.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                        results.push({
                            type: 'experience',
                            role: exp.role,
                            company: exp.company,
                            timeline: exp.timeline,
                            description: exp.description,
                            name: profile.name
                        });
                    }
                });
            }

            // Check project matches
            profile.projects.forEach(project => {
                if (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    project.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                    results.push({
                        type: 'project',
                        title: project.title,
                        description: project.description,
                        skills: project.skills,
                        timeline: project.timeline,
                        name: profile.name
                    });
                }
            });
        });

        console.log(`Search results found: ${results.length} items`);
        console.log('Results summary:', results.map(r => `${r.type}: ${r.name || r.title || r.skill}`));

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


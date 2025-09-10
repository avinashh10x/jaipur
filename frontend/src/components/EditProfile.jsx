import React, { useState, useEffect } from 'react';
import './EditProfile.css';

const EditProfile = ({ profile, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        portfolio: '',
        education: [{ degree: '', college: '', cgpa: '', start_year: '', end_year: '' }],
        skills: [],
        projects: [{ title: '', description: '', timeline: '', skills: [] }],
        experience: [{ role: '', company: '', timeline: '', description: '' }],
        languages: [],
        links: { github: '', linkedin: '', portfolio: '' }
    });
    const [skillInput, setSkillInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [projectSkillInputs, setProjectSkillInputs] = useState(['']);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                portfolio: profile.portfolio || '',
                education: profile.education?.length > 0 ? profile.education : [{ degree: '', college: '', cgpa: '', start_year: '', end_year: '' }],
                skills: profile.skills || [],
                projects: profile.projects?.length > 0 ? profile.projects : [{ title: '', description: '', timeline: '', skills: [] }],
                experience: profile.experience?.length > 0 ? profile.experience : [{ role: '', company: '', timeline: '', description: '' }],
                languages: profile.languages || [],
                links: profile.links || { github: '', linkedin: '', portfolio: '' }
            });
            setProjectSkillInputs(profile.projects?.map(() => '') || ['']);
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...formData.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setFormData(prev => ({ ...prev, education: newEducation }));
    };

    const handleProjectChange = (index, field, value) => {
        const newProjects = [...formData.projects];
        newProjects[index] = { ...newProjects[index], [field]: value };
        setFormData(prev => ({ ...prev, projects: newProjects }));
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...formData.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setFormData(prev => ({ ...prev, experience: newExperience }));
    };

    const handleLinksChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            links: { ...prev.links, [field]: value }
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const addLanguage = () => {
        if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, languageInput.trim()]
            }));
            setLanguageInput('');
        }
    };

    const removeLanguage = (languageToRemove) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter(lang => lang !== languageToRemove)
        }));
    };

    const addProjectSkill = (projectIndex) => {
        const skillToAdd = projectSkillInputs[projectIndex];
        if (skillToAdd.trim() && !formData.projects[projectIndex].skills.includes(skillToAdd.trim())) {
            const newProjects = [...formData.projects];
            newProjects[projectIndex].skills = [...newProjects[projectIndex].skills, skillToAdd.trim()];
            setFormData(prev => ({ ...prev, projects: newProjects }));

            const newInputs = [...projectSkillInputs];
            newInputs[projectIndex] = '';
            setProjectSkillInputs(newInputs);
        }
    };

    const removeProjectSkill = (projectIndex, skillToRemove) => {
        const newProjects = [...formData.projects];
        newProjects[projectIndex].skills = newProjects[projectIndex].skills.filter(skill => skill !== skillToRemove);
        setFormData(prev => ({ ...prev, projects: newProjects }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', college: '', cgpa: '', start_year: '', end_year: '' }]
        }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', description: '', timeline: '', skills: [] }]
        }));
        setProjectSkillInputs(prev => [...prev, '']);
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { role: '', company: '', timeline: '', description: '' }]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setIsSaving(true);
            await onSave(formData);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="edit-profile-overlay">
            <div className="edit-profile-modal">
                <div className="edit-profile-header">
                    <h2>✏️ Edit Profile</h2>
                    <button onClick={onCancel} className="close-btn">×</button>
                </div>

                <form onSubmit={handleSubmit} className="edit-profile-form">
                    {/* Personal Information */}
                    <div className="form-section">
                        <h3>Personal Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <span className="error-text">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <span className="error-text">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Portfolio Website</label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="form-section">
                        <h3>Skills</h3>
                        <div className="skill-input-container">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Add a skill"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                            />
                            <button type="button" onClick={addSkill}>Add</button>
                        </div>
                        <div className="skills-list">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="form-section">
                        <h3>Education</h3>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="education-item">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Degree</label>
                                        <input
                                            type="text"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>College</label>
                                        <input
                                            type="text"
                                            value={edu.college}
                                            onChange={(e) => handleEducationChange(index, 'college', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>CGPA</label>
                                        <input
                                            type="text"
                                            value={edu.cgpa}
                                            onChange={(e) => handleEducationChange(index, 'cgpa', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Start Year</label>
                                        <input
                                            type="number"
                                            value={edu.start_year}
                                            onChange={(e) => handleEducationChange(index, 'start_year', parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Year</label>
                                        <input
                                            type="number"
                                            value={edu.end_year}
                                            onChange={(e) => handleEducationChange(index, 'end_year', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addEducation} className="add-btn">+ Add Education</button>
                    </div>

                    {/* Projects */}
                    <div className="form-section">
                        <h3>Projects</h3>
                        {formData.projects.map((project, index) => (
                            <div key={index} className="project-item">
                                <div className="form-group">
                                    <label>Project Title</label>
                                    <input
                                        type="text"
                                        value={project.title}
                                        onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={project.description}
                                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Timeline</label>
                                    <input
                                        type="text"
                                        value={project.timeline}
                                        onChange={(e) => handleProjectChange(index, 'timeline', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Technologies</label>
                                    <div className="skill-input-container">
                                        <input
                                            type="text"
                                            value={projectSkillInputs[index] || ''}
                                            onChange={(e) => {
                                                const newInputs = [...projectSkillInputs];
                                                newInputs[index] = e.target.value;
                                                setProjectSkillInputs(newInputs);
                                            }}
                                            placeholder="Add technology"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProjectSkill(index))}
                                        />
                                        <button type="button" onClick={() => addProjectSkill(index)}>Add</button>
                                    </div>
                                    <div className="skills-list">
                                        {project.skills.map((skill, skillIndex) => (
                                            <span key={skillIndex} className="skill-tag">
                                                {skill}
                                                <button type="button" onClick={() => removeProjectSkill(index, skill)}>×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addProject} className="add-btn">+ Add Project</button>
                    </div>

                    {/* Experience */}
                    <div className="form-section">
                        <h3>Experience</h3>
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="experience-item">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Role</label>
                                        <input
                                            type="text"
                                            value={exp.role}
                                            onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Company</label>
                                        <input
                                            type="text"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Timeline</label>
                                        <input
                                            type="text"
                                            value={exp.timeline}
                                            onChange={(e) => handleExperienceChange(index, 'timeline', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                        rows="2"
                                    />
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addExperience} className="add-btn">+ Add Experience</button>
                    </div>

                    {/* Languages */}
                    <div className="form-section">
                        <h3>Languages</h3>
                        <div className="skill-input-container">
                            <input
                                type="text"
                                value={languageInput}
                                onChange={(e) => setLanguageInput(e.target.value)}
                                placeholder="Add a language"
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                            />
                            <button type="button" onClick={addLanguage}>Add</button>
                        </div>
                        <div className="skills-list">
                            {formData.languages.map((language, index) => (
                                <span key={index} className="skill-tag">
                                    {language}
                                    <button type="button" onClick={() => removeLanguage(language)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="form-section">
                        <h3>Social Links</h3>
                        <div className="form-group">
                            <label>GitHub</label>
                            <input
                                type="url"
                                value={formData.links.github}
                                onChange={(e) => handleLinksChange('github', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                value={formData.links.linkedin}
                                onChange={(e) => handleLinksChange('linkedin', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Portfolio</label>
                            <input
                                type="url"
                                value={formData.links.portfolio}
                                onChange={(e) => handleLinksChange('portfolio', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="save-btn">
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;

import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import './ProjectsBySkill.css';

const ProjectsBySkill = ({ skill, onBack }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (skill) {
            loadProjectsBySkill(skill);
        }
    }, [skill]);

    const loadProjectsBySkill = async (skillName) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileAPI.getProjectsBySkill(skillName);
            setProjects(response.data);
        } catch (error) {
            console.error('Error loading projects by skill:', error);
            setError('Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="projects-by-skill">
                <div className="projects-header">
                    <button onClick={onBack} className="back-btn">
                        ← Back
                    </button>
                    <h3>Projects with "{skill}"</h3>
                </div>
                <div className="projects-loading">
                    <div className="spinner"></div>
                    <p>Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="projects-by-skill">
                <div className="projects-header">
                    <button onClick={onBack} className="back-btn">
                        ← Back
                    </button>
                    <h3>Projects with "{skill}"</h3>
                </div>
                <div className="projects-error">
                    <p>{error}</p>
                    <button onClick={() => loadProjectsBySkill(skill)} className="btn retry-btn">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-by-skill">
            <div className="projects-header">
                <button onClick={onBack} className="back-btn">
                    ← Back
                </button>
                <div>
                    <h3>Projects with "{skill}"</h3>
                    <p>{projects.length} project{projects.length !== 1 ? 's' : ''} found</p>
                </div>
            </div>

            {projects.length > 0 ? (
                <div className="projects-grid">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <div className="project-header">
                                <h4 className="project-title">{project.title}</h4>
                            </div>

                            <p className="project-description">{project.description}</p>

                            <div className="project-skills">
                                <span className="skills-label">Technologies:</span>
                                <div className="skills-list">
                                    {project.skills.map((skillName, skillIndex) => (
                                        <span
                                            key={skillIndex}
                                            className={`skill-tag ${skillName.toLowerCase() === skill.toLowerCase() ? 'highlighted' : ''}`}
                                        >
                                            {skillName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-projects">
                    <div className="no-projects-content">
                        <div className="no-projects-icon">🔍</div>
                        <h3>No Projects Found</h3>
                        <p>No projects found using "{skill}" technology.</p>
                        <button onClick={onBack} className="btn">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsBySkill;

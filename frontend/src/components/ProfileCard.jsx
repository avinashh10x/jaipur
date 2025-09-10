import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ profile, onEdit }) => {
    if (!profile) return null;

    return (
        <div className="profile-card fade-in">
            <div className="profile-header">
                <div className="profile-info-section">
                    <div className="profile-avatar">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1 className="profile-name">{profile.name}</h1>
                        <p className="profile-email">{profile.email}</p>
                        {profile.phone && <p className="profile-phone">{profile.phone}</p>}
                    </div>
                </div>
                {onEdit && (
                    <button onClick={onEdit} className="edit-profile-btn" title="Edit Profile">
                        ✏️ Edit
                    </button>
                )}
            </div>

            {profile.portfolio && (
                <div className="profile-section">
                    <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-link"
                    >
                        🌐 View Portfolio
                    </a>
                </div>
            )}

            {profile.education && profile.education.length > 0 && (
                <div className="profile-section">
                    <h3 className="section-title">🎓 Education</h3>
                    {profile.education.map((edu, index) => (
                        <div key={index} className="education-item">
                            <h4>{edu.degree}</h4>
                            <p className="institution">{edu.college}</p>
                            {edu.cgpa && <p className="cgpa">CGPA: {edu.cgpa}</p>}
                            <p className="duration">
                                {edu.start_year} - {edu.end_year}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {profile.skills && profile.skills.length > 0 && (
                <div className="profile-section">
                    <h3 className="section-title">💻 Skills</h3>
                    <div className="skills-container">
                        {profile.skills.map((skill, index) => (
                            <span key={index} className="skill-tag">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {profile.projects && profile.projects.length > 0 && (
                <div className="profile-section">
                    <h3 className="section-title">🚀 Projects</h3>
                    {profile.projects.map((project, index) => (
                        <div key={index} className="project-item">
                            <h4 className="project-title">{project.title}</h4>
                            <p className="project-description">{project.description}</p>
                            {project.timeline && (
                                <p className="project-timeline">⏱️ {project.timeline}</p>
                            )}
                            {project.skills && project.skills.length > 0 && (
                                <div className="project-skills">
                                    {project.skills.map((skill, skillIndex) => (
                                        <span key={skillIndex} className="project-skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {profile.experience && profile.experience.length > 0 && (
                <div className="profile-section">
                    <h3 className="section-title">💼 Experience</h3>
                    {profile.experience.map((exp, index) => (
                        <div key={index} className="experience-item">
                            <h4>{exp.role}</h4>
                            <p className="company">{exp.company}</p>
                            <p className="timeline">{exp.timeline}</p>
                            {exp.description && (
                                <p className="description">{exp.description}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {profile.languages && profile.languages.length > 0 && (
                <div className="profile-section">
                    <h3 className="section-title">🌍 Languages</h3>
                    <div className="languages-container">
                        {profile.languages.map((language, index) => (
                            <span key={index} className="language-tag">
                                {language}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {profile.links && (
                <div className="profile-section">
                    <h3 className="section-title">🔗 Links</h3>
                    <div className="links-container">
                        {profile.links.github && (
                            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="social-link">
                                📁 GitHub
                            </a>
                        )}
                        {profile.links.linkedin && (
                            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                💼 LinkedIn
                            </a>
                        )}
                        {profile.links.portfolio && (
                            <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
                                🌐 Portfolio
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCard;

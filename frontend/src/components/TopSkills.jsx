import React, { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import './TopSkills.css';

const TopSkills = ({ onSkillClick }) => {
    const [topSkills, setTopSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTopSkills();
    }, []);

    const loadTopSkills = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileAPI.getTopSkills();
            setTopSkills(response.data);
        } catch (error) {
            console.error('Error loading top skills:', error);
            setError('Failed to load top skills');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkillClick = (skill) => {
        if (onSkillClick) {
            onSkillClick(skill);
        }
    };

    if (isLoading) {
        return (
            <div className="top-skills">
                <div className="top-skills-header">
                    <h3>🔥 Trending Skills</h3>
                </div>
                <div className="skills-loading">
                    <div className="spinner-small"></div>
                    <p>Loading trending skills...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="top-skills">
                <div className="top-skills-header">
                    <h3>🔥 Trending Skills</h3>
                </div>
                <div className="skills-error">
                    <p>{error}</p>
                    <button onClick={loadTopSkills} className="btn-retry-small">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="top-skills">
            <div className="top-skills-header">
                <h3>🔥 Trending Skills</h3>
                <p>Most popular skills across all profiles</p>
            </div>

            {topSkills.length > 0 ? (
                <div className="skills-grid">
                    {topSkills.map((skill, index) => (
                        <button
                            key={index}
                            className={`skill-pill rank-${Math.min(index + 1, 3)}`}
                            onClick={() => handleSkillClick(skill)}
                            title={`Click to see projects with ${skill}`}
                        >
                            <span className="skill-rank">#{index + 1}</span>
                            <span className="skill-name">{skill}</span>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="no-skills">
                    <p>No skill data available</p>
                </div>
            )}
        </div>
    );
};

export default TopSkills;

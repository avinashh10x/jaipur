import React from 'react';
import './SearchResults.css';

const SearchResults = ({ results, isLoading, query }) => {
    console.log('🔍 SearchResults received:', { results, isLoading, query });

    if (isLoading) {
        return (
            <div className="search-results">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Searching for "{query}"...</p>
                </div>
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="search-results">
                <div className="no-results">
                    <div className="no-results-icon">🔍</div>
                    <h3>No results found for "{query}"</h3>
                    <p>Try searching for different keywords or check your spelling.</p>
                </div>
            </div>
        );
    }

    console.log('📊 Displaying search results:', results.length, 'items');

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.type]) {
            acc[result.type] = [];
        }
        acc[result.type].push(result);
        return acc;
    }, {});

    const getTypeIcon = (type) => {
        switch (type) {
            case 'profile': return '👤';
            case 'project': return '🚀';
            case 'education': return '🎓';
            case 'experience': return '💼';
            case 'skill': return '🛠️';
            default: return '📄';
        }
    };

    const getTypeTitle = (type) => {
        switch (type) {
            case 'profile': return 'Profiles';
            case 'project': return 'Projects';
            case 'education': return 'Education';
            case 'experience': return 'Experience';
            case 'skill': return 'Skills';
            default: return 'Other';
        }
    };

    return (
        <div className="search-results fade-in">
            <div className="results-header">
                <h2>Search Results for "{query}"</h2>
                <p className="results-count">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
            </div>

            {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="results-section">
                    <h3 className="results-section-title">
                        {getTypeIcon(type)} {getTypeTitle(type)} ({items.length})
                    </h3>

                    <div className="results-grid">
                        {items.map((result, index) => (
                            <div key={index} className="result-card">
                                {result.type === 'profile' && (
                                    <div className="result-content">
                                        <div className="result-header">
                                            <div className="result-avatar">
                                                {result.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="result-title">{result.name}</h4>
                                                <p className="result-subtitle">{result.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {result.type === 'project' && (
                                    <div className="result-content">
                                        <h4 className="result-title">{result.title}</h4>
                                        <p className="result-description">{result.description}</p>
                                        {result.timeline && (
                                            <p className="result-timeline">⏱️ {result.timeline}</p>
                                        )}
                                        {result.name && (
                                            <p className="result-person">👤 {result.name}</p>
                                        )}
                                        {result.skills && result.skills.length > 0 && (
                                            <div className="result-skills">
                                                {result.skills.slice(0, 5).map((skill, skillIndex) => (
                                                    <span key={skillIndex} className="result-skill-tag">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {result.skills.length > 5 && (
                                                    <span className="result-skill-tag more">
                                                        +{result.skills.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {result.type === 'education' && (
                                    <div className="result-content">
                                        <h4 className="result-title">{result.degree}</h4>
                                        <p className="result-subtitle">{result.college}</p>
                                        <div className="result-details">
                                            {result.cgpa && <span className="result-detail">CGPA: {result.cgpa}</span>}
                                            <span className="result-detail">
                                                {result.start_year} - {result.end_year}
                                            </span>
                                        </div>
                                        {result.name && (
                                            <p className="result-person">👤 {result.name}</p>
                                        )}
                                    </div>
                                )}

                                {result.type === 'experience' && (
                                    <div className="result-content">
                                        <h4 className="result-title">{result.role}</h4>
                                        <p className="result-subtitle">{result.company}</p>
                                        <p className="result-timeline">⏱️ {result.timeline}</p>
                                        {result.description && (
                                            <p className="result-description">{result.description}</p>
                                        )}
                                        {result.name && (
                                            <p className="result-person">👤 {result.name}</p>
                                        )}
                                    </div>
                                )}

                                {result.type === 'skill' && (
                                    <div className="result-content">
                                        <h4 className="result-title">{result.skill}</h4>
                                        <p className="result-subtitle">Skill found in profile</p>
                                        {result.name && (
                                            <p className="result-person">👤 {result.name}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;

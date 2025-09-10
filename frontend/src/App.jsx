import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import SearchResults from './components/SearchResults';
import TopSkills from './components/TopSkills';
import ProjectsBySkill from './components/ProjectsBySkill';
import EditProfile from './components/EditProfile';
import { profileAPI } from './services/api';
import './App.css';

function App() {
    const [profile, setProfile] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [viewMode, setViewMode] = useState('home'); // 'home', 'search', 'skill-projects', 'edit'
    const [isEditMode, setIsEditMode] = useState(false);

    // Load profile data on component mount
    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileAPI.getProfile();
            setProfile(response.data);
        } catch (error) {
            console.error('Error loading profile:', error);
            setError('Failed to load profile. Make sure the backend server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (query) => {
        if (!query || query.trim() === '') {
            setError('Please enter a search term');
            return;
        }

        try {
            setIsSearching(true);
            setSearchQuery(query);
            setViewMode('search');
            setError(null);

            console.log('🔍 Starting search for:', query);
            const response = await profileAPI.searchProfiles(query);
            console.log('📋 Search results received:', response.data);

            setSearchResults(response.data);
        } catch (error) {
            console.error('❌ Search failed:', error);
            setError(`Search failed: ${error.message}`);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }; const handleClearSearch = () => {
        setViewMode('home');
        setSearchResults(null);
        setSearchQuery('');
        setSelectedSkill(null);
        setError(null);
    };

    const handleSkillClick = (skill) => {
        setSelectedSkill(skill);
        setViewMode('skill-projects');
        setError(null);
    };

    const handleBackToHome = () => {
        setViewMode('home');
        setSelectedSkill(null);
        setSearchResults(null);
        setSearchQuery('');
        setIsEditMode(false);
        setError(null);
    };

    const handleEditProfile = () => {
        setIsEditMode(true);
        setViewMode('edit');
    };

    const handleSaveProfile = async (updatedProfile) => {
        try {
            setError(null);
            const response = await profileAPI.createOrUpdateProfile(updatedProfile);

            if (response.data.profile) {
                setProfile(response.data.profile);
            } else {
                // If no profile returned, reload it
                await loadProfile();
            }

            setIsEditMode(false);
            setViewMode('home');
        } catch (error) {
            console.error('Error saving profile:', error);
            setError('Failed to save profile. Please try again.');
            throw error; // Re-throw to let EditProfile component handle it
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setViewMode('home');
        setError(null);
    };

    return (
        <div className="app">
            <div className="app-container">
                <header className="app-header">
                    <div className="header-content">
                        <h1 className="app-title">
                            {viewMode === 'search' ? '🔍 Search Results' :
                                viewMode === 'skill-projects' ? `� ${selectedSkill} Projects` :
                                    'Profile Dashboard'}
                        </h1>
                        <p className="app-subtitle">
                            {viewMode === 'search'
                                ? 'Find profiles, projects, and more'
                                : viewMode === 'skill-projects'
                                    ? `Projects using ${selectedSkill} technology`
                                    : 'Welcome to your professional profile'
                            }
                        </p>
                    </div>
                </header>

                <main className="app-main">
                    <div className="search-section">
                        <SearchBar
                            onSearch={handleSearch}
                            onClear={handleClearSearch}
                            isLoading={isSearching}
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            <div className="error-content">
                                <span className="error-icon">⚠️</span>
                                <p>{error}</p>
                                {error.includes('backend') && (
                                    <button
                                        onClick={loadProfile}
                                        className="btn retry-btn"
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="content-section">
                        {viewMode === 'search' ? (
                            <SearchResults
                                results={searchResults}
                                isLoading={isSearching}
                                query={searchQuery}
                            />
                        ) : viewMode === 'skill-projects' ? (
                            <ProjectsBySkill
                                skill={selectedSkill}
                                onBack={handleBackToHome}
                            />
                        ) : (
                            <>
                                {isLoading ? (
                                    <div className="loading">
                                        <div className="spinner"></div>
                                        <p>Loading profile...</p>
                                    </div>
                                ) : profile ? (
                                    <>
                                        <TopSkills onSkillClick={handleSkillClick} />
                                        <ProfileCard
                                            profile={profile}
                                            onEdit={handleEditProfile}
                                        />
                                    </>
                                ) : (
                                    <div className="no-profile">
                                        <div className="no-profile-content">
                                            <h3>No Profile Found</h3>
                                            <p>No profile data available. Please check your backend connection.</p>
                                            <button onClick={loadProfile} className="btn">
                                                Reload Profile
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>

                {/* Edit Profile Modal */}
                {isEditMode && (
                    <EditProfile
                        profile={profile}
                        onSave={handleSaveProfile}
                        onCancel={handleCancelEdit}
                    />
                )}

                <footer className="app-footer">
                    <p>&copy; 2025 Profile Dashboard. Built with React & Vite.</p>
                </footer>
            </div>
        </div>
    );
}

export default App;

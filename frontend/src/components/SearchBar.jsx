import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear, isLoading = false }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <div className="search-bar-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search profiles, projects, skills..."
                        className="input search-input"
                        disabled={isLoading}
                    />
                    <div className="search-buttons">
                        {query && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="btn-clear"
                                disabled={isLoading}
                            >
                                ✕
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn btn-search"
                            disabled={isLoading || !query.trim()}
                        >
                            {isLoading ? (
                                <div className="spinner-small"></div>
                            ) : (
                                '🔍'
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SearchBar;

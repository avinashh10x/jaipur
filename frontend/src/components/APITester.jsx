import React, { useState } from 'react';
import { profileAPI } from '../services/api';

const APITester = () => {
    const [testResults, setTestResults] = useState({});
    const [isRunning, setIsRunning] = useState(false);

    const runTests = async () => {
        setIsRunning(true);
        const results = {};

        // Test 1: Health Check
        try {
            const response = await profileAPI.healthCheck();
            results.health = { success: true, data: response.data };
        } catch (error) {
            results.health = { success: false, error: error.message };
        }

        // Test 2: Get Profile
        try {
            const response = await profileAPI.getProfile();
            results.profile = { success: true, data: response.data };
        } catch (error) {
            results.profile = { success: false, error: error.message };
        }

        // Test 3: Search
        try {
            const response = await profileAPI.searchProfiles('react');
            results.search = { success: true, data: response.data };
        } catch (error) {
            results.search = { success: false, error: error.message };
        }

        // Test 4: Top Skills
        try {
            const response = await profileAPI.getTopSkills();
            results.topSkills = { success: true, data: response.data };
        } catch (error) {
            results.topSkills = { success: false, error: error.message };
        }

        setTestResults(results);
        setIsRunning(false);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'white',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            zIndex: 9999,
            maxWidth: '400px',
            maxHeight: '80vh',
            overflow: 'auto'
        }}>
            <h3>API Tester</h3>
            <button
                onClick={runTests}
                disabled={isRunning}
                style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {isRunning ? 'Testing...' : 'Run API Tests'}
            </button>

            {Object.keys(testResults).length > 0 && (
                <div style={{ marginTop: '15px' }}>
                    {Object.entries(testResults).map(([test, result]) => (
                        <div key={test} style={{ marginBottom: '10px' }}>
                            <strong>{test}:</strong>
                            <span style={{
                                color: result.success ? 'green' : 'red',
                                marginLeft: '10px'
                            }}>
                                {result.success ? '✅ Success' : '❌ Failed'}
                            </span>
                            {!result.success && (
                                <div style={{ fontSize: '12px', color: 'red', marginTop: '5px' }}>
                                    {result.error}
                                </div>
                            )}
                            {result.success && result.data && (
                                <div style={{ fontSize: '12px', color: 'gray', marginTop: '5px' }}>
                                    Data length: {Array.isArray(result.data) ? result.data.length : 'object'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default APITester;

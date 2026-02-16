import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './createRepository.css';
import logo from '../../assets/github-mark-white.svg';

const CreateRepository = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility: true // true = public, false = private
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.name.trim()) {
            setError('Repository name is required');
            return;
        }

        // Get userId from localStorage
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('Please login first');
            navigate('/login');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/repo/create', {
                name: formData.name.trim(),
                description: formData.description.trim(),
                visibility: formData.visibility,
                owner: userId,
                content: [],
                issues: []
            });

            console.log('Repository created:', response.data);
            // Navigate to repositories list or dashboard
            navigate('/repositories');
        } catch (err) {
            console.error('Error creating repository:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to create repository';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-repo-container">
            <div className="create-repo-content">
                <div className="create-repo-header">
                    <div className="logo-header" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <img src={logo} alt="GitHub" style={{ width: '32px', height: '32px' }} />
                        <span style={{ fontSize: '20px', fontWeight: '600', color: '#f0f6fc' }}>GitHub Clone</span>
                    </div>
                    <h1>Create a new repository</h1>
                    <p className="subtitle">
                        A repository contains all project files, including the revision history.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="create-repo-form">
                    {error && (
                        <div className="error-message">
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0zm9.78-2.22-5.5 5.5a.75.75 0 0 1-1.06-1.06l5.5-5.5a.75.75 0 0 1 1.06 1.06z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name" className="form-label required">
                            Repository name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="my-awesome-project"
                            className="form-input"
                            required
                        />
                        <p className="form-hint">
                            Great repository names are short and memorable.
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description <span className="optional">(optional)</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="A brief description of your repository"
                            className="form-textarea"
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <div className="visibility-section">
                            <div className="visibility-header">
                                <h3>Visibility</h3>
                                <p>Choose who can see this repository</p>
                            </div>

                            <div className="visibility-options">
                                <label className={`visibility-option ${formData.visibility ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        checked={formData.visibility}
                                        onChange={() => setFormData(prev => ({ ...prev, visibility: true }))}
                                    />
                                    <div className="option-content">
                                        <div className="option-header">
                                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm9.78-2.22-5.5 5.5a.75.75 0 0 1-1.06-1.06l5.5-5.5a.75.75 0 0 1 1.06 1.06Z" />
                                            </svg>
                                            <strong>Public</strong>
                                        </div>
                                        <p className="option-description">
                                            Anyone on the internet can see this repository
                                        </p>
                                    </div>
                                </label>

                                <label className={`visibility-option ${!formData.visibility ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="visibility"
                                        checked={!formData.visibility}
                                        onChange={() => setFormData(prev => ({ ...prev, visibility: false }))}
                                    />
                                    <div className="option-content">
                                        <div className="option-header">
                                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                                <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z" />
                                            </svg>
                                            <strong>Private</strong>
                                        </div>
                                        <p className="option-description">
                                            You choose who can see and commit to this repository
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-create"
                        >
                            {loading ? 'Creating...' : 'Create repository'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRepository;

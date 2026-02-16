import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './issues.css';
import logo from '../../assets/github-mark-white.svg';

const CreateIssue = () => {
    const { id } = useParams(); // repository ID
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.title.trim()) {
            setError('Issue title is required');
            return;
        }
        if (!formData.description.trim()) {
            setError('Issue description is required');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/issue/create', {
                title: formData.title.trim(),
                description: formData.description.trim(),
                repository: id,
                status: 'open'
            });

            console.log('Issue created:', response.data);
            navigate(`/repository/${id}`);
        } catch (err) {
            console.error('Error creating issue:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to create issue';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-issue-container">
            <div className="create-issue-content">
                <div className="create-issue-header">
                    <div className="logo-header" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <img src={logo} alt="GitHub" style={{ width: '32px', height: '32px' }} />
                        <span style={{ fontSize: '20px', fontWeight: '600', color: '#f0f6fc' }}>GitHub Clone</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <h1>Create a new issue</h1>
                        <button
                            onClick={() => navigate(`/repository/${id}`)}
                            className="btn-back-repo"
                        >
                            Back to Repository
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="create-issue-form">
                    {error && (
                        <div className="error-message">
                            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0zm9.78-2.22-5.5 5.5a.75.75 0 0 1-1.06-1.06l5.5-5.5a.75.75 0 0 1 1.06 1.06z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title" className="form-label required">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Brief description of the issue"
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label required">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Detailed description of the issue..."
                            className="form-textarea"
                            rows="8"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate(`/repository/${id}`)}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-submit"
                        >
                            {loading ? 'Creating...' : 'Create Issue'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateIssue;

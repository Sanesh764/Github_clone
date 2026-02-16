import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './repository.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

const RepositoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [repository, setRepository] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [starsCount, setStarsCount] = useState(0);
    const [showForkModal, setShowForkModal] = useState(false);
    const [forkName, setForkName] = useState('');
    const [forking, setForking] = useState(false);

    useEffect(() => {
        fetchRepository();
        checkStarStatus();
    }, [id]);

    const fetchRepository = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/repo/${id}`);
            setRepository(response.data[0]); // API returns array
            if (response.data[0]) {
                setStarsCount(response.data[0].stars || 0);
            }
        } catch (err) {
            console.error('Error fetching repository:', err);
            setError('Failed to load repository');
        } finally {
            setLoading(false);
        }
    };

    const checkStarStatus = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        
        try {
            const response = await axios.get(`http://localhost:3000/repo/star-status/${id}`, {
                params: { userId }
            });
            setIsStarred(response.data.starred);
            setStarsCount(response.data.stars);
        } catch (err) {
            console.error('Error checking star status:', err);
        }
    };

    const handleToggleVisibility = async () => {
        try {
            await axios.patch(`http://localhost:3000/repo/toggle/${id}`);
            fetchRepository(); // Refresh data
        } catch (err) {
            console.error('Error toggling visibility:', err);
            setError('Failed to toggle visibility');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/repo/delete/${id}`);
            navigate('/repositories');
        } catch (err) {
            console.error('Error deleting repository:', err);
            setError('Failed to delete repository');
        }
    };

    const handleStar = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('Please login to star repositories');
            return;
        }
        
        try {
            const response = await axios.post(`http://localhost:3000/repo/star/${id}`, { userId });
            setIsStarred(response.data.starred);
            setStarsCount(response.data.stars);
        } catch (err) {
            console.error('Error starring repository:', err);
            setError(err.response?.data?.error || 'Failed to star repository');
        }
    };

    const handleFork = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('Please login to fork repositories');
            return;
        }
        
        if (!forkName.trim()) {
            setError('Please enter a name for the forked repository');
            return;
        }
        
        setForking(true);
        try {
            const response = await axios.post(`http://localhost:3000/repo/fork/${id}`, {
                owner: userId,
                name: forkName.trim()
            });
            setShowForkModal(false);
            setForkName('');
            navigate(`/repository/${response.data.repositoryID}`);
        } catch (err) {
            console.error('Error forking repository:', err);
            setError(err.response?.data?.error || 'Failed to fork repository');
            setForking(false);
        }
    };

    if (loading) {
        return (
            <div className="repo-detail-container">
                <div className="loading">Loading repository...</div>
            </div>
        );
    }

    if (error || !repository) {
        return (
            <div className="repo-detail-container">
                <div className="error-message">{error || 'Repository not found'}</div>
                <button onClick={() => navigate('/repositories')} className="btn-back">
                    Back to Repositories
                </button>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="repo-detail-container">
            {/* Repository Header */}
            <div className="repo-detail-header">
                <div className="repo-title-section">
                    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                    </svg>
                    <h1>{repository.name}</h1>
                    <span className={`visibility-badge ${repository.visibility ? 'public' : 'private'}`}>
                        {repository.visibility ? 'Public' : 'Private'}
                    </span>
                </div>

                <div className="repo-actions">
                    <button onClick={handleStar} className={`btn-star ${isStarred ? 'starred' : ''}`}>
                        <svg viewBox="0 0 16 16" width="16" height="16" fill={isStarred ? "currentColor" : "none"} stroke="currentColor">
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                        </svg>
                        {isStarred ? 'Unstar' : 'Star'} ({starsCount})
                    </button>
                    <button onClick={() => setShowForkModal(true)} className="btn-fork">
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                        </svg>
                        Fork ({repository.forks || 0})
                    </button>
                    {repository.owner?._id === localStorage.getItem('userId') && (
                        <>
                            <button onClick={handleToggleVisibility} className="btn-toggle">
                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                    <path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0ZM8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Z" />
                                </svg>
                                Toggle Visibility
                            </button>
                            <button onClick={() => setShowDeleteConfirm(true)} className="btn-delete">
                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                    <path d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z" />
                                </svg>
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Description */}
            {repository.description && (
                <div className="repo-description-box">
                    <p>{repository.description}</p>
                </div>
            )}

            {/* Owner Info */}
            <div className="repo-info-section">
                <h2>Repository Information</h2>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Owner:</span>
                        <span className="info-value">
                            {repository.owner?.username || 'Unknown'}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Visibility:</span>
                        <span className="info-value">
                            {repository.visibility ? 'Public' : 'Private'}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Issues:</span>
                        <span className="info-value">
                            {repository.issues?.length || 0}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Stars:</span>
                        <span className="info-value">
                            {repository.stars || 0}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Forks:</span>
                        <span className="info-value">
                            {repository.forks || 0}
                        </span>
                    </div>
                    {repository.forkedFrom && (
                        <div className="info-item">
                            <span className="info-label">Forked from:</span>
                            <span className="info-value">
                                {repository.forkedFrom.name || 'Unknown'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Issues Section */}
            <div className="repo-issues-section">
                <div className="section-header">
                    <h2>Issues</h2>
                    <button
                        onClick={() => navigate(`/repository/${id}/create-issue`)}
                        className="btn-new-issue"
                    >
                        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7.25-3.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" />
                        </svg>
                        New Issue
                    </button>
                </div>

                {repository.issues && repository.issues.length > 0 ? (
                    <div className="issues-list">
                        {repository.issues.map((issue) => (
                            <div key={issue._id} className="issue-item">
                                <div className="issue-header">
                                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
                                    </svg>
                                    <h3>{issue.title}</h3>
                                    <span className={`issue-status ${issue.status}`}>
                                        {issue.status}
                                    </span>
                                </div>
                                <p className="issue-description">{issue.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-issues">
                        <p>No issues yet. Create one to get started!</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Delete Repository</h2>
                        <p>Are you sure you want to delete <strong>{repository.name}</strong>?</p>
                        <p className="warning-text">This action cannot be undone.</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn-cancel">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="btn-confirm-delete">
                                Delete Repository
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fork Modal */}
            {showForkModal && (
                <div className="modal-overlay" onClick={() => { setShowForkModal(false); setForkName(''); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Fork Repository</h2>
                        <p>Create a copy of <strong>{repository.name}</strong> in your account.</p>
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9', fontSize: '14px' }}>
                                Repository Name:
                            </label>
                            <input
                                type="text"
                                value={forkName}
                                onChange={(e) => setForkName(e.target.value)}
                                placeholder={`${repository.name}-fork`}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    backgroundColor: '#0d1117',
                                    border: '1px solid #30363d',
                                    borderRadius: '6px',
                                    color: '#f0f6fc',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                                autoFocus
                            />
                        </div>
                        <div className="modal-actions">
                            <button 
                                onClick={() => { setShowForkModal(false); setForkName(''); }} 
                                className="btn-cancel"
                                disabled={forking}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleFork} 
                                className="btn-fork-confirm"
                                disabled={forking || !forkName.trim()}
                            >
                                {forking ? 'Forking...' : 'Fork Repository'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footer />
        </>
    );
};

export default RepositoryDetail;

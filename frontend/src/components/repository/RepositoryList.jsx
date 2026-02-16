import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './repository.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

const RepositoryList = () => {
    const navigate = useNavigate();
    const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRepositories();
    }, []);

    const fetchRepositories = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/repo/user/${userId}`);
            setRepositories(response.data.repositories || []);
        } catch (err) {
            console.error('Error fetching repositories:', err);
            setError('Failed to load repositories');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="repo-list-container">
                <div className="loading">Loading repositories...</div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="repo-list-container">
            <div className="repo-list-header">
                <h1>Your Repositories</h1>
                <button
                    className="btn-new-repo"
                    onClick={() => navigate('/create-repository')}
                >
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7.25-3.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" />
                    </svg>
                    New Repository
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {repositories.length === 0 ? (
                <div className="empty-state">
                    <svg viewBox="0 0 16 16" width="48" height="48" fill="currentColor">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                    </svg>
                    <h2>No repositories yet</h2>
                    <p>Create your first repository to get started!</p>
                    <button
                        className="btn-create-first"
                        onClick={() => navigate('/create-repository')}
                    >
                        Create Repository
                    </button>
                </div>
            ) : (
                <div className="repo-grid">
                    {repositories.map((repo) => (
                        <div
                            key={repo._id}
                            className="repo-card"
                            onClick={() => navigate(`/repository/${repo._id}`)}
                        >
                            <div className="repo-card-header">
                                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                                </svg>
                                <h3 className="repo-name">{repo.name}</h3>
                            </div>

                            {repo.description && (
                                <p className="repo-description">{repo.description}</p>
                            )}

                            <div className="repo-meta">
                                <span className={`repo-visibility ${repo.visibility ? 'public' : 'private'}`}>
                                    {repo.visibility ? (
                                        <>
                                            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                                                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
                                            </svg>
                                            Public
                                        </>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                                                <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Z" />
                                            </svg>
                                            Private
                                        </>
                                    )}
                                </span>
                                {repo.issues && repo.issues.length > 0 && (
                                    <span className="repo-issues">
                                        <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
                                        </svg>
                                        {repo.issues.length} {repo.issues.length === 1 ? 'issue' : 'issues'}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <Footer />
        </>
    );
};

export default RepositoryList;

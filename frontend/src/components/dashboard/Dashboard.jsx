import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

const Dashboard = () => {
    const navigate = useNavigate();
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("Please login to view your repositories");
            setLoading(false);
            return;
        }

        const fetchRepositories = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRepositories(data.repositories || []);
            } catch (err) {
                console.error("error while fetching repositories:", err);
                setError("Failed to load repositories. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchRepositories();
    }, []);

    useEffect(() => {
        const fetchSuggestedRepositories = async () => {
            try {
                const response = await fetch(`http://localhost:3000/repo/all`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSuggestedRepositories(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("error while fetching suggested repositories:", err);
            }
        };
        fetchSuggestedRepositories();
    }, []);

    useEffect(() => {
        if (searchQuery === "") {
            setSearchResult(repositories);
        } else {
            const filteredRepo = repositories.filter((repo) => {
                return repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            })
            setSearchResult(filteredRepo);
        }
    }, [searchQuery, repositories]);
    return (
        <>
            <Navbar />
            <section id="dashboard">
                <aside>
                    <h3>Suggested Repositories</h3>
                    {suggestedRepositories && suggestedRepositories.length > 0 ? (
                        suggestedRepositories.slice(0, 5).map((repo) => {
                            return (
                                <div
                                    key={repo._id}
                                    className="repo-card"
                                    onClick={() => navigate(`/repository/${repo._id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h4>{repo.name}</h4>
                                    {repo.description && <p>{repo.description}</p>}
                                    {(repo.stars !== undefined || repo.forks !== undefined) && (
                                        <div className="repo-stats-small">
                                            {repo.stars !== undefined && (
                                                <span className="stat-item-small">
                                                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                                                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                                                    </svg>
                                                    {repo.stars || 0}
                                                </span>
                                            )}
                                            {repo.forks !== undefined && (
                                                <span className="stat-item-small">
                                                    <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
                                                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                                                    </svg>
                                                    {repo.forks || 0}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No suggested repositories</p>
                    )}
                </aside>
                <main>
                    <h2>Your Repositories</h2>
                    <div id="search">
                        <input type="text" value={searchQuery} placeholder="search..." onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    {loading ? (
                        <div className="loading-state">
                            <p>Loading repositories...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                        </div>
                    ) : searchResult && searchResult.length > 0 ? (
                        searchResult.map((repo) => {
                            return (
                                <div
                                    key={repo._id}
                                    className="repo-card"
                                    onClick={() => navigate(`/repository/${repo._id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="repo-card-header">
                                        <h4>{repo.name}</h4>
                                        <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
                                            {repo.visibility ? 'Public' : 'Private'}
                                        </span>
                                    </div>
                                    {repo.description && <p className="repo-description">{repo.description}</p>}
                                    <div className="repo-stats">
                                        {repo.stars !== undefined && (
                                            <span className="stat-item">
                                                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                                    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                                                </svg>
                                                {repo.stars || 0}
                                            </span>
                                        )}
                                        {repo.forks !== undefined && (
                                            <span className="stat-item">
                                                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                                    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
                                                </svg>
                                                {repo.forks || 0}
                                            </span>
                                        )}
                                        {repo.issues && repo.issues.length > 0 && (
                                            <span className="stat-item">
                                                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                                                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                                </svg>
                                                {repo.issues.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <p>No repositories found</p>
                            <button 
                                onClick={() => navigate('/create-repository')} 
                                className="btn-create-repo"
                            >
                                Create Repository
                            </button>
                        </div>
                    )}
                </main>
                <aside>
                    <h3>Upcoming Events</h3>
                    <ul>
                        <li><p>Tech Conference - Dec 15</p></li>
                        <li><p>Developer meetup - Jan 15</p></li>
                        <li><p>React Summit - Dec 25</p></li>
                    </ul>
                </aside>
            </section>
            <Footer />
        </>
    );
};

export default Dashboard;
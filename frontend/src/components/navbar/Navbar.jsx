import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/github-mark-white.svg";

const Navbar = () => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/auth");
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo and Search */}
                <div className="navbar-left">
                    <div className="navbar-logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="GitHub" />
                        <span>GitHub Clone</span>
                    </div>
                    <div className="navbar-search">
                        <input type="text" placeholder="Search or jump to..." />
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="navbar-center">
                    <button onClick={() => navigate('/repositories')}>Pull requests</button>
                    <button onClick={() => navigate('/repositories')}>Issues</button>
                    <button onClick={() => navigate('/create-repository')}>Create repository</button>
                    <button onClick={() => navigate('/profile')}>Profile</button>
                    <button onClick={() => navigate('/repositories')}>Explore</button>
                </div>

                {/* Right Side - Notifications, Plus, Profile */}
                <div className="navbar-right">
                    <button className="icon-btn" title="Notifications">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16zM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A.25.25 0 0 1 14.537 11h-13.074a.25.25 0 0 1-.208-.359l1.703-2.555A.25.25 0 0 0 3 7.947V5z"></path>
                        </svg>
                    </button>

                    <button className="icon-btn" title="Create new...">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2z"></path>
                        </svg>
                    </button>

                    <div className="profile-menu-container">
                        <button className="profile-btn" onClick={toggleProfileMenu}>
                            <div className="profile-avatar">
                                <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0zM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z"></path>
                                </svg>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <div className="dropdown-item" onClick={() => navigate("/profile")}>
                                    Your profile
                                </div>
                                <div className="dropdown-item" onClick={() => navigate("/repositories")}>Your repositories</div>
                                <div className="dropdown-item">Your projects</div>
                                <div className="dropdown-item">Your stars</div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item">Settings</div>
                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item" onClick={handleLogout}>
                                    Sign out
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

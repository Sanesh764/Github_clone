import React, { useEffect, useState } from 'react';
import './profile.css';
import Navbar from '../navbar/Navbar';
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeatMapProfile from './HeatMap';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userDetails, setUserDetails] = useState({
    username: "username",
    avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=0D8ABC",
    followers: 0,
    following: 0
  });

  // Handle image error by setting a fallback
  const handleImageError = (e) => {
    e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${userDetails.username}&backgroundColor=0D8ABC`;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
          const userData = response.data;
          // Set avatar with fallback to generated avatar based on username
          if (!userData.avatarUrl) {
            userData.avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userData.username}&backgroundColor=0D8ABC`;
          }
          setUserDetails({
            ...userData,
            followers: userData.followers || 0,
            following: userData.following || 0
          });
        } catch (err) {
          console.error("can't fetch user details:", err);
        }
      }
    };
    fetchUserDetails();
  }, []);
  return (
    <div className="github-profile">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <svg className="github-logo" height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="logo-text">GitHub</span>
          </div>
          <nav className="nav-links">
            <button onClick={() => navigate('/create-repository')} className="nav-link">Create a Repository</button>
            <button onClick={() => navigate('/profile')} className="nav-link">Profile</button>
          </nav>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0114.25 16H1.75A1.75 1.75 0 010 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V1.75a.25.25 0 00-.25-.25H1.75z" />
              <path d="M3.5 3.5h9v1.75h-9V3.5zm0 4h5.75v1.75H3.5V7.5z" />
            </svg>
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'starred' ? 'active' : ''}`}
            onClick={() => setActiveTab('starred')}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
              <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
            </svg>
            Starred Repositories
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="profile-section">
          {/* Profile Avatar */}
          <div className="avatar-container">
            <img
              src={userDetails.avatarUrl}
              alt="Profile"
              className="avatar"
              onError={handleImageError}
            />
          </div>

          {/* Username */}
          <h1 className="username">{userDetails.username}</h1>

          {/* Follow Button */}
          <button className="follow-btn">Follow</button>

          {/* Follower Stats */}
          <div className="stats">
            <a href="#" className="stat-link">
              <span className="stat-number">{userDetails.followers}</span> Follower
            </a>
            <span className="stat-separator">·</span>
            <a href="#" className="stat-link">
              <span className="stat-number">{userDetails.following}</span> Following
            </a>
          </div>
        </div>

        <div className='heat-map-section'>
          <HeatMapProfile />
        </div>
      </div>
    </div>
  );
};

export default Profile;

# 🐙 GitHub Clone

<div align="center">

![GitHub Clone](https://img.shields.io/badge/GitHub-Clone-blue?style=for-the-badge&logo=github)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

**A full-stack GitHub clone application built with React and Node.js, featuring repository management, issue tracking, and a custom Git-like CLI.**

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Custom Git CLI](#-custom-git-cli)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

GitHub Clone is a comprehensive full-stack web application that replicates core GitHub functionalities. It provides a modern, responsive interface for managing repositories, tracking issues, and collaborating on projects. The application includes both a web interface and a custom command-line interface for Git-like operations.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based authentication with password hashing
- 📦 **Repository Management** - Create, view, star, fork, and manage repositories
- 🐛 **Issue Tracking** - Create and manage issues for repositories
- 👤 **User Profiles** - Comprehensive user profile management
- 🎨 **Modern UI** - Built with GitHub's Primer design system
- ⚡ **Real-time Updates** - Socket.io integration for live updates
- 💾 **Cloud Storage** - AWS S3 integration for file storage

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration** - Secure signup with email validation
- **User Login** - JWT token-based authentication
- **Session Management** - Persistent login with localStorage
- **Protected Routes** - Route guards for authenticated users

### 📦 Repository Management
- **Create Repositories** - Public and private repository creation
- **Repository Dashboard** - View all your repositories in one place
- **Repository Details** - Detailed view with description, stats, and metadata
- **Search Functionality** - Search repositories by name
- **Star/Unstar** - Star repositories to save them for later
- **Fork Repositories** - Fork existing repositories to your account
- **Repository Statistics** - View stars, forks, watchers, and issues count
- **Visibility Toggle** - Switch between public and private repositories
- **Delete Repositories** - Remove repositories you own

### 🐛 Issue Tracking
- **Create Issues** - Add issues to repositories with title and description
- **View Issues** - Browse all issues for a repository
- **Issue Status** - Track open/closed status
- **Issue Management** - Update and delete issues

### 👤 User Profile
- **Profile View** - View user information and statistics
- **Activity Heatmap** - Visual representation of user activity
- **Repository List** - All repositories owned by the user
- **Profile Editing** - Update email and password

### 🎨 User Interface
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - GitHub-inspired dark color scheme
- **Modern Navigation** - Intuitive navigation with clickable GitHub logo
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **Vite** | 7.3.1 | Build Tool & Dev Server |
| **React Router** | 7.13.0 | Client-side Routing |
| **Axios** | 1.13.5 | HTTP Client |
| **Primer React** | 38.11.0 | UI Component Library |
| **React Heat Map** | 2.3.3 | Activity Visualization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | Latest | Runtime Environment |
| **Express.js** | 5.2.1 | Web Framework |
| **MongoDB** | 7.1.0 | Database (Native Driver) |
| **Mongoose** | 9.2.1 | ODM for MongoDB |
| **Socket.io** | 4.8.3 | Real-time Communication |
| **JWT** | 9.0.3 | Authentication Tokens |
| **bcryptjs** | 3.0.3 | Password Hashing |
| **AWS SDK** | 2.1693.0 | S3 File Storage |
| **Yargs** | 18.0.0 | CLI Parser |

---

## 📂 Project Structure

```
githup-clone/
│
├── backend/                      # Backend Server
│   ├── config/                   # Configuration files
│   │   └── aws-config.js         # AWS S3 configuration
│   │
│   ├── controllers/              # Business Logic
│   │   ├── userController.js     # User operations
│   │   ├── repoController.js     # Repository operations
│   │   ├── issueController.js    # Issue operations
│   │   ├── init.js               # Git init command
│   │   ├── add.js                # Git add command
│   │   ├── commit.js             # Git commit command
│   │   ├── push.js               # Git push command
│   │   ├── pull.js               # Git pull command
│   │   └── revert.js              # Git revert command
│   │
│   ├── models/                   # Database Schemas
│   │   ├── userModel.js          # User schema
│   │   ├── repoModel.js          # Repository schema
│   │   └── issueModel.js         # Issue schema
│   │
│   ├── routes/                   # API Routes
│   │   ├── main.router.js        # Main router
│   │   ├── user.router.js        # User routes
│   │   ├── repo.router.js        # Repository routes
│   │   └── issue.router.js       # Issue routes
│   │
│   ├── index.js                  # Server entry point
│   ├── package.json              # Dependencies
│   └── .env                      # Environment variables
│
├── frontend/                     # Frontend Client
│   ├── src/
│   │   ├── components/           # React Components
│   │   │   ├── auth/             # Authentication components
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   │
│   │   │   ├── dashboard/        # Dashboard components
│   │   │   │   └── Dashboard.jsx
│   │   │   │
│   │   │   ├── repository/       # Repository components
│   │   │   │   ├── CreateRepository.jsx
│   │   │   │   ├── RepositoryList.jsx
│   │   │   │   └── RepositoryDetail.jsx
│   │   │   │
│   │   │   ├── issues/           # Issue components
│   │   │   │   └── CreateIssue.jsx
│   │   │   │
│   │   │   ├── user/             # User components
│   │   │   │   ├── Profile.jsx
│   │   │   │   └── HeatMap.jsx
│   │   │   │
│   │   │   ├── navbar/           # Navigation
│   │   │   │   └── Navbar.jsx
│   │   │   │
│   │   │   └── footer/           # Footer
│   │   │       └── Footer.jsx
│   │   │
│   │   ├── assets/               # Static assets
│   │   │   └── github-mark-white.svg
│   │   │
│   │   ├── authContext.jsx       # Auth context provider
│   │   ├── Routes.jsx            # Route configuration
│   │   ├── App.jsx               # Root component
│   │   └── main.jsx              # Entry point
│   │
│   ├── package.json              # Dependencies
│   └── vite.config.js            # Vite configuration
│
└── README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas) (or local MongoDB)
- **AWS Account** (Optional) - For S3 file storage

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/githup-clone.git
cd githup-clone
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGODB_URL=your_mongodb_atlas_connection_string
   JWT_SECRET_KEY=your_jwt_secret_key_here
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   ```

4. Start the backend server:
   ```bash
   npm start
   # or with nodemon for development
   nodemon index.js start
   ```

   The server will start on `http://localhost:3000`

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## ⚙️ Configuration

### MongoDB Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and add it to `.env` as `MONGODB_URL`

### AWS S3 Setup (Optional)

1. Create an AWS account
2. Create an S3 bucket
3. Create an IAM user with S3 access
4. Add credentials to `.env` file

---

## 💻 Usage

### Web Application

1. **Sign Up**: Create a new account
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your repositories and suggested repositories
4. **Create Repository**: Click "Create repository" to add a new repo
5. **Manage Repositories**: View, edit, star, fork, or delete repositories
6. **Create Issues**: Add issues to repositories
7. **View Profile**: Check your profile and activity

### Custom Git CLI

The backend includes a custom Git-like CLI. Use it from the backend directory:

```bash
# Start the server
node index.js start

# Initialize a repository
node index.js init

# Add a file to staging
node index.js add filename.txt

# Commit staged files
node index.js commit "Your commit message"

# Push to S3
node index.js push

# Pull from S3
node index.js pull

# Revert to a commit
node index.js revert <commitId>
```

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/signup`
Create a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "userId": "user_id_here"
}
```

#### POST `/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "userId": "user_id_here"
}
```

### Repository Endpoints

#### GET `/repo/user/:userID`
Get all repositories for a specific user.

**Response:**
```json
{
  "message": "Repositories found !",
  "repositories": [...]
}
```

#### GET `/repo/all`
Get all public repositories.

#### GET `/repo/:id`
Get a specific repository by ID.

#### POST `/repo/create`
Create a new repository.

**Request Body:**
```json
{
  "name": "my-repo",
  "description": "Repository description",
  "visibility": true,
  "owner": "user_id",
  "content": [],
  "issues": []
}
```

#### POST `/repo/star/:id`
Star or unstar a repository.

**Request Body:**
```json
{
  "userId": "user_id"
}
```

#### POST `/repo/fork/:id`
Fork a repository.

**Request Body:**
```json
{
  "owner": "user_id",
  "name": "forked-repo-name"
}
```

#### DELETE `/repo/delete/:id`
Delete a repository.

### Issue Endpoints

#### POST `/issue/create`
Create a new issue.

**Request Body:**
```json
{
  "title": "Issue title",
  "description": "Issue description",
  "repository": "repo_id",
  "status": "open"
}
```

#### GET `/issue/all`
Get all issues for a repository.

---

## 🎮 Custom Git CLI

The application includes a custom Git-like CLI for managing repositories programmatically.

### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `init` | Initialize a new repository | `node index.js init` |
| `add <file>` | Add file to staging area | `node index.js add app.js` |
| `commit <message>` | Commit staged files | `node index.js commit "Initial commit"` |
| `push` | Push commits to S3 | `node index.js push` |
| `pull` | Pull commits from S3 | `node index.js pull` |
| `revert <commitId>` | Revert to a specific commit | `node index.js revert abc123` |

---

## 📸 Screenshots

> **Note:** Add screenshots of your application here

- Dashboard View
- Repository Creation
- Issue Tracking
- User Profile

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Sanesh Kumar**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [GitHub](https://github.com) - For inspiration
- [Primer Design System](https://primer.style/) - For UI components
- [React](https://reactjs.org/) - For the amazing framework
- [MongoDB](https://www.mongodb.com/) - For the database

---

<div align="center">

**Made with ❤️ using React and Node.js**

⭐ Star this repo if you find it helpful!

</div>

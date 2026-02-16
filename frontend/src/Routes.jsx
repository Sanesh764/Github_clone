import React, { useEffect } from "react";
import { useNavigate, useRoutes } from 'react-router-dom';

//page list
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepository from "./components/repository/CreateRepository";
import RepositoryList from "./components/repository/RepositoryList";
import RepositoryDetail from "./components/repository/RepositoryDetail";
import CreateIssue from "./components/issues/CreateIssue";

//Auth context
import { useAuth } from "./authContext";

const ProjectRoutes = () => {
    const { currentUser, setCurrentUser } = useAuth();

    const navigate = useNavigate();
    useEffect(() => {
        const userIdFromStorage = localStorage.getItem("userId");
        if (userIdFromStorage && !currentUser) {
            setCurrentUser(userIdFromStorage);
        }
        if (!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname)) {
            navigate("/auth");
        }
        if (userIdFromStorage && window.location.pathname == "/auth") {
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path: "/",
            element: <Dashboard />
        },
        {
            path: "/dashboard",
            element: <Dashboard />
        },
        {
            path: "/auth",
            element: <Login />
        },
        {
            path: "/signup",
            element: <Signup />
        },
        {
            path: "/profile",
            element: <Profile />
        },
        {
            path: "/create-repository",
            element: <CreateRepository />
        },
        {
            path: "/repositories",
            element: <RepositoryList />
        },
        {
            path: "/repository/:id",
            element: <RepositoryDetail />
        },
        {
            path: "/repository/:id/create-issue",
            element: <CreateIssue />
        }
    ]);
    return element;
}
export default ProjectRoutes;
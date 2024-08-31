import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import Profile from './pages/Profile';
import AllUsers from "./pages/AllUsersPage";
import UsersProfile from './pages/UsersProfilePage';
import ConversationPage from './pages/ConversationPage';

import useStore from './store/mainStore';

import './App.css';
import ConversationsListPage from "./pages/ConversationsListPage";

function App() {
    const { setUser, setToken } = useStore(state => ({
        setUser: state.setUser,
        setToken: state.setToken,
    }));

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            setToken(token);
            setUser(JSON.parse(user));
        }
    }, [setUser, setToken]);
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/all-users" element={<AllUsers />} />
                <Route path="/users/:username" element={<UsersProfile />} />
                <Route path="/chat/conversations" element={<ConversationsListPage />} /> {/* Route for conversations list */}

                <Route path="/chat/conversations/:conversationId/messages" element={<ConversationPage />} /> {/* New Route */}

            </Routes>
        </Router>
    );
}

export default App;

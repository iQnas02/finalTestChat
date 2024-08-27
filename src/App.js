import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar';
import Register from './pages/RegisterPage';
import Login from './pages/LoginPage';
import Profile from './pages/Profile';
import useStore from './store/mainStore'; // Adjust the path as needed
import './App.css';

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
            </Routes>
        </Router>
    );
}

export default App;

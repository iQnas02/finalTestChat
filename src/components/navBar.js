import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/mainStore';

function Navbar() {
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    const setToken = useStore(state => state.setToken);
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear Zustand store
        setUser(null);
        setToken('');

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Navigate to login page
        navigate('/login');
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            {user ? (
                <>
                    <Link to="/profile">Profile</Link>
                    <Link to="/all-users">All Users</Link>
                    <Link to="/conversations">Conversations</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            )}
        </nav>
    );
}

export default Navbar;

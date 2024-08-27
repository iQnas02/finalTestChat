import React, { useState } from 'react';
import axios from 'axios';
import useStore from '../store/mainStore';

function Profile() {
    const user = useStore(state => state.user);
    const token = useStore(state => state.token);
    const setUser = useStore(state => state.setUser);

    const [newImageUrl, setNewImageUrl] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    if (!user) {
        return <div className="container"><p>You need to log in first.</p></div>;
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (newPassword && newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:2000/update-profile',
                {
                    newImageUrl,
                    newPassword,
                    newUsername
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setUser(response.data.data);
                setMessage('Profile updated successfully');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Profile</h2>
            <p>Username: {user.username}</p>
            <img src={user.image} alt="Profile" />
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label htmlFor="newUsername">New Username:</label>
                    <input
                        type="text"
                        id="newUsername"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="newImageUrl">New Profile Picture URL:</label>
                    <input
                        type="text"
                        id="newImageUrl"
                        placeholder="New Image URL"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="newPassword">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {message && <p className="message">{message}</p>}
                {error && <p className="error">{error}</p>}
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}

export default Profile;

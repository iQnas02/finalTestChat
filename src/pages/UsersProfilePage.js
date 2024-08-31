import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useStore from '../store/mainStore';
import SendMessage from '../components/SendMessage';

function UsersProfile() {
    const { username } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const token = useStore(state => state.token);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await axios.get(`http://localhost:2000/users/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (data.success) {
                    setUserProfile(data.data);
                }
            } catch (err) {
                console.log('Failed to fetch user profile', err);
            }
        };

        fetchUserProfile();
    }, [username, token]);

    if (!userProfile) return <p>Loading...</p>;

    return (
        <div>
            <h2>{userProfile.username}'s Profile</h2>
            <img src={userProfile.image} alt={userProfile.username} />
            <SendMessage receiverId={userProfile._id} />
        </div>
    );
}

export default UsersProfile;

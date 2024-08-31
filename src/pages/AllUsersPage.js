import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useStore from '../store/mainStore';

const API_URL = 'http://localhost:2000';

const AllUsersPage = () => {
    const [users, setUsers] = useState([]);
    const token = useStore((state) => state.token);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/all-users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setUsers(data.data);
                }
            } catch (err) {
                console.log('Failed to fetch users', err);
            }
        };

        fetchUsers();
    }, [token]);

    return (
        <div>
            <h2>All Users</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {users.map((user) => (
                    <div key={user._id} style={{ margin: '10px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', width: '200px' }}>
                        <img src={user.image} alt={user.username} style={{ width: '100%', borderRadius: '8px' }} />
                        <h3>{user.username}</h3>
                        <Link to={`/users/${user.username}`}>View Profile</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllUsersPage;

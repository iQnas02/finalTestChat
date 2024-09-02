import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useStore from '../store/mainStore';

const API_URL = 'http://localhost:2000';

function ConversationsListPage() {
    const [conversations, setConversations] = useState([]);
    const token = useStore(state => state.token);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await axios.get(`${API_URL}/chat/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setConversations(response.data.data);
                } else {
                    console.error('Failed to fetch conversations:', response.data.message);
                }
            } catch (err) {
                console.error('Error fetching conversations:', err);
            }
        };

        fetchConversations();
    }, [token]);

    const handleDeleteConversation = async (conversationId) => {
        try {
            const response = await axios.delete(`${API_URL}/chat/conversations/${conversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // Update the conversation list after deletion
                setConversations(conversations.filter(conversation => conversation._id !== conversationId));
            } else {
                console.error('Failed to delete conversation:', response.data.message);
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
        }
    };
    return (
        <div>
            <h2>Your Conversations</h2>
            <ul>
                {conversations.map(conversation => (
                    <li key={conversation._id}>
                        <Link to={`/chat/conversations/${conversation._id}/messages`}>
                            {conversation.title || 'Unnamed Conversation'}
                        </Link>
                        <button onClick={() => handleDeleteConversation(conversation._id)} style={{marginLeft: '10px'}}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ConversationsListPage;

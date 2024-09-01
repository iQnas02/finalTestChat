import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useStore from '../store/mainStore';

const API_URL = 'http://localhost:2000';

function ConversationPage() {
    const { conversationId } = useParams();
    const token = useStore(state => state.token);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${API_URL}/chat/conversations/${conversationId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setMessages(response.data.data);
                } else {
                    console.error('Failed to fetch messages:', response.data.message);
                }
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };

        fetchMessages();
    }, [conversationId, token]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') {
            console.warn('Cannot send an empty message');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/chat/conversations/${conversationId}/message`, {
                text: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setMessages(prevMessages => [...prevMessages, response.data.data]);
                setNewMessage('');

            } else {
                console.error('Failed to send message:', response.data.message);
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    return (
        <div>
            <h2>Conversation</h2>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className="message"
                         style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                        <img
                            src={message.sender.image}
                            alt={`${message.sender.username}'s profile`}
                            style={{width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px'}}
                        />
                        <strong>{message.sender.username}</strong>: {message.text}
                        <div className="message-time"
                        style={{marginLeft: '10px', marginRight: '10px'}}>
                            {new Date(message.createdAt).toLocaleString('lt-LT', {
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric'
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
}

export default ConversationPage;

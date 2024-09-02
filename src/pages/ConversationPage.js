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


        fetchMessages();
    }, [conversationId, token]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') {
            console.warn('Cannot send an empty message');
            return;
        }

        try {

            const response = await axios.post(`${API_URL}/chat/conversationsa/${conversationId}/message`, {
                text: newMessage.toString(),


            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                // setMessages(prevMessages => [...prevMessages, response.data.data]);
                fetchMessages()
                setNewMessage('');

            } else {
                console.error('Failed to send message:', response.data.message);
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleLikeMessage = async (messageId) => {
        try {
            const response = await axios.post(`${API_URL}/chat/conversations/${conversationId}/messages/${messageId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                fetchMessages(); // Refresh messages after liking
            } else {
                if (response.data.message === "You cannot like your own message") {
                    console.warn("You cannot like your own message");
                } else {
                    console.error('Failed to like/unlike message:', response.data.message);
                }
            }
        } catch (err) {
            console.error('Error liking message:', err);
        }
    };



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
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Conversation</h2>
            <div style={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <div key={index} style={styles.message}>
                        <img
                            src={message.sender.image}
                            alt={`${message.sender.username}'s profile`}
                            style={styles.avatar}
                        />
                        <div style={styles.messageContent}>
                            <div style={styles.messageHeader}>
                                <strong style={styles.username}>{message.sender.username}</strong>
                                <span style={styles.messageTime}>
                                    {new Date(message.createdAt).toLocaleString('lt-LT', {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric'
                                    })}
                                </span>
                            </div>
                            <p style={styles.messageText}>{message.text}</p>
                            <div style={styles.messageActions}>
                                <button style={styles.likeButton} onClick={() => handleLikeMessage(message._id)}>
                                    {message.likedBy.includes(token.userId) ? 'Unlike' : 'Like'}
                                </button>
                                <span style={styles.likeCount}>{message.likedBy.length} Likes</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                    style={styles.input}
                />
                <button style={styles.sendButton} onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '20px',
    },
    messagesContainer: {
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    message: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '20px',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#f1f1f1',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        marginRight: '15px',
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '5px',
    },
    username: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
    },
    messageTime: {
        fontSize: '12px',
        color: '#999',
    },
    messageText: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '10px',
    },
    messageActions: {
        display: 'flex',
        alignItems: 'center',
    },
    likeButton: {
        padding: '5px 10px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#007BFF',
        color: '#fff',
        marginRight: '10px',
    },
    likeCount: {
        fontSize: '14px',
        color: '#555',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '20px',
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '14px',
        marginRight: '10px',
    },
    sendButton: {
        padding: '10px 20px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#28a745',
        color: '#fff',
    }
};

export default ConversationPage;

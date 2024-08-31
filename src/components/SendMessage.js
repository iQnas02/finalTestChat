import React, { useState } from 'react';
import axios from 'axios';
import useStore from '../store/mainStore';

function SendMessage({ receiverId }) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = useStore(state => state.token);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:2000/send-message',
                { receiverId, text: message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setSuccess('Message sent successfully');
                setMessage('');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSendMessage}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                ></textarea>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
}

export default SendMessage;

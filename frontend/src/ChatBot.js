import React, { useState } from 'react';
import axios from 'axios';

function ChatBot() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, { message });
            const botResponse = res.data.response;

            // Update messages with both user and bot responses
            setMessages([...messages, { sender: "user", text: message }, { sender: "bot", text: botResponse }]);
            setResponse(botResponse);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Chat with the AI Bot</h2>
            <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
                {messages.map((msg, index) => (
                    <p key={index} style={{ color: msg.sender === "user" ? "blue" : "green" }}>
                        <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {String(msg.text)}
                    </p>
                ))}
            </div>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                style={{ width: "80%" }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatBot;

import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import "../styles/ChatBot.css"; 

function ChatBot({ messages, isFavourited, toggleFavourite }) {
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (!message.trim()) return;
        console.log("Sending message:", message);
        setMessage(""); 
    };

    return (
        <div className="chat-bot-container">
            {/* Chat Display */}
            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
                    >
                        <p className="message-text">
                            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {String(msg.text)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="input-container">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message"
                    className="chat-input"
                />
                <button className="favourite-button" onClick={toggleFavourite}>
                    {isFavourited ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                </button>
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
}

export default ChatBot;

import React from 'react';
import "../styles/ChatBot.css"; // 🔹 Import the new ChatBot.css

function ChatBot({ messages, message, setMessage, sendMessage }) {
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

            {/* Input Area */}
            <div className="input-container">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message"
                    className="chat-input"
                />
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
}

export default ChatBot;

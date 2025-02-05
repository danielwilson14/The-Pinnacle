import React from 'react';

function ChatBot({ messages, message, setMessage, sendMessage }) {
    return (
        <div style={styles.chatBotContainer}>
            {/* Chat Display */}
            <div style={styles.messagesContainer}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.messageBubble,
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: msg.sender === 'user' ? '#d1f7c4' : '#f1f0f0',
                        }}
                    >
                        <p style={styles.messageText}>
                            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {String(msg.text)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div style={styles.inputContainer}>
                <input
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        console.log("Input updated to:", e.target.value); // Debug log for input changes
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { 
                            e.preventDefault(); 
                            sendMessage(); 
                        }
                    }}
                    placeholder="Type your message"
                    style={styles.input}
                />
                <button
                    onClick={() => {
                        console.log("Send button clicked"); // Debug log for button clicks
                        sendMessage(); // Trigger the sendMessage function
                    }}
                    style={styles.sendButton}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

const styles = {
    chatBotContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
    messagesContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'stretch', // Ensures proper alignment

    },
    messageText: {
        margin: 0,
    },
    messageBubble: {
        maxWidth: '60%',
        padding: '10px',
        borderRadius: '15px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    },
    inputContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    input: {
        flexGrow: 1,
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    sendButton: {
        padding: '10px',
        backgroundColor: '#6abf69',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default ChatBot;

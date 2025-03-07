import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import "../styles/Chat.css";

function ChatPage() {
    const { chatId: routeChatId } = useParams();
    const [chatId, setChatId] = useState(routeChatId || null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isFavourited, setIsFavourited] = useState(false);
    const [botThinking, setBotThinking] = useState(false); // ⏳ Track if bot is "thinking"
    const [thinkingDots, setThinkingDots] = useState(""); // 💬 Animated dots
    const [typingMessage, setTypingMessage] = useState(""); // 📝 Bot typing effect
    const navigate = useNavigate();
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    
    // 🔽 Auto-scroll reference
    const messagesEndRef = useRef(null);

    // ⏳ Animate "thinking" dots
    useEffect(() => {
        if (botThinking) {
            const interval = setInterval(() => {
                setThinkingDots(prev => (prev === "..." ? "" : prev + "."));
            }, 500);
            return () => clearInterval(interval);
        }
    }, [botThinking]);

    // 🚀 Fetch chat messages if chatId exists
    useEffect(() => {
        const fetchChat = async () => {
            if (chatId) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chats/${chatId}`);
                    setMessages(res.data.messages.map(msg => ({
                        sender: msg.role === "user" ? "user" : "bot",
                        text: msg.content,
                    })));
                    setIsFavourited(res.data.isFavourited || false);
                } catch (error) {
                    console.error("Error fetching chat:", error);
                }
            }
        };
        fetchChat();
    }, [chatId]);

    // 🚀 Function to simulate typing effect for bot responses
    const typeOutMessage = (fullMessage) => {
        const adjustedMessage = " " + fullMessage; // ✅ Add space workaround for first letter issue
        
        setTypingMessage(""); // Reset typing message
        setBotThinking(false); // ✅ Immediately stop "thinking"

        // ✅ Remove "Bot is thinking..." before typing starts
        setMessages(prevMessages => prevMessages.filter(msg => msg.text !== "Bot is thinking"));

        let index = 0;
        const interval = setInterval(() => {
            if (index < adjustedMessage.length) {
                setTypingMessage(prev => prev + adjustedMessage[index]);
                index++;
            } else {
                clearInterval(interval);

                setMessages(prevMessages => [
                    ...prevMessages.filter(msg => msg.text !== "Bot is thinking"),  // ✅ Only remove the placeholder
                    { sender: "bot", text: fullMessage.trim() }
                ]);
                

                setTypingMessage(""); // Reset
            }
        }, 15); // Typing speed
    };

    // 🚀 Send message
    const sendMessage = async () => {
        if (!message.trim()) return;
        
        const userId = localStorage.getItem("userId") || "anonymous";
        const payload = { user_id: userId, message, chat_id: chatId };
    
        // ✅ Instantly add user message to chat
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "user", text: message }
        ]);
    
        setMessage(""); // Clear input field
    
        // ✅ Show "Bot is thinking..." placeholder
        setBotThinking(true);
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "bot", text: "Bot is thinking" }
        ]);
    
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, payload);
            const botResponse = res.data.assistant_reply;
    
            if (!chatId) {
                setChatId(res.data.chat_id);
                navigate(`/chat/${res.data.chat_id}`);
                return
            }
    
            // ✅ Check if the bot response already exists before adding it
            setMessages(prevMessages => {
                const botAlreadyExists = prevMessages.some(
                    msg => msg.sender === "bot" && msg.text === botResponse
                );
    
                if (!botAlreadyExists) {
                    typeOutMessage(botResponse); // Start typing effect
                }
    
                return prevMessages;
            });
    
        } catch (error) {
            console.error("Error sending message:", error);
            setBotThinking(false);
        }
    };
    

    // ⭐ Toggle chat favourite
    const toggleFavourite = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/favourites/toggle`, { chat_id: chatId });
            setIsFavourited(!isFavourited);
        } catch (error) {
            console.error("Error toggling favourite:", error);
        }
    };

    // 🔽 Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typingMessage]);

    return (
        <div className={`chat-page-container ${isDarkMode ? "dark-mode" : ""}`}>
            <Navbar />
            <div className="chat-container">
                {/* Chat Messages */}
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
                        >
                            <p className="message-text">
                                <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {String(msg.text)}
                                {botThinking && msg.text.startsWith("Bot is thinking") && <span>{thinkingDots}</span>}
                            </p>
                        </div>
                    ))}
                    {/* 🔽 Typing effect placeholder */}
                    {typingMessage && (
                        <div className="message-bubble bot">
                            <p className="message-text">
                                <strong>Bot:</strong> {typingMessage}
                            </p>
                        </div>
                    )}
                    {/* 🔽 Auto-scroll target */}
                    <div ref={messagesEndRef} />
                </div>
    
                {/* Message Input */}
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
        </div>
    );
}

export default ChatPage;

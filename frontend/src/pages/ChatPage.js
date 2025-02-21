import React, { useState, useEffect } from "react";
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
    const navigate = useNavigate();
    const isDarkMode = localStorage.getItem("darkMode") === "true";

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

    // 🚀 Send message
    const sendMessage = async () => {
        if (!message.trim()) return;
        
        const userId = localStorage.getItem("userId") || "anonymous";
        const payload = { user_id: userId, message, chat_id: chatId };

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, payload);
            const botResponse = res.data.assistant_reply;

            if (!chatId) {
                setChatId(res.data.chat_id);
                navigate(`/chat/${res.data.chat_id}`);
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { sender: "user", text: message },
                { sender: "bot", text: botResponse },
            ]);

            setMessage("");

            // 🚨 Serious message detection
            const seriousKeywords = ["suicide", "depressed", "self-harm", "hopeless"];
            if (seriousKeywords.some(word => message.toLowerCase().includes(word))) {
                const confirmRedirect = window.confirm(
                    "It sounds like you're going through something serious. Would you like to see professional help options?"
                );
                if (confirmRedirect) {
                    navigate("/professional-help");
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
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
                            </p>
                        </div>
                    ))}
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

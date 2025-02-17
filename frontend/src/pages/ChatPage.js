import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBot from "../components/ChatBot";
import Navbar from "../components/Navbar";
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import "../styles/ChatPage.css";

function ChatPage() {
    const { chatId: routeChatId } = useParams();
    const [chatId, setChatId] = useState(routeChatId || null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isFavourited, setIsFavourited] = useState(false); 
    const navigate = useNavigate();
    const isDarkMode = localStorage.getItem("darkMode") === "true";

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

            // 🚨 If message is serious, suggest help page
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
                <ChatBot 
                    messages={messages} 
                    isFavourited={isFavourited} 
                    toggleFavourite={toggleFavourite}
                />
            </div>
        </div>
    );
}

export default ChatPage;

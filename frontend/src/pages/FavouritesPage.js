import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "../styles/FavouritesPage.css";

function FavouritesPage({ isDarkMode }) {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavouriteChats = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/favourites`, {
                    params: { user_id: userId },
                });
                setChats(res.data);
            } catch (error) {
                console.error("Error fetching favourite chats:", error);
            }
        };
        fetchFavouriteChats();
    }, []);

    const deleteChat = async (chatId) => {
        if (!window.confirm("Are you sure you want to delete this chat?")) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/chats/${chatId}`);
            setChats(chats.filter(chat => chat._id !== chatId));
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    };

    return (
        <div className={`favourites-chats-wrapper ${isDarkMode ? "dark-mode" : ""}`}>
            <Navbar />
            <div className="chats-container">
                <h2 className="heading">Favourites</h2>
                <div className="chat-list">
                    {chats.map((chat) => (
                        <div key={chat._id} className="chat-card">
                            <div className="chat-info" onClick={() => navigate(`/chat/${chat._id}`)}>
                                <h3 className="chat-title">{chat.chat_name || "Untitled Chat"}</h3>
                                <p className="chat-summary">{chat.summary || "No summary available."}</p>
                            </div>
                            <button className="delete-button" onClick={() => deleteChat(chat._id)}>
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FavouritesPage;

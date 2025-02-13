import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import Heart Icons
import "../styles/PreviousChats.css";

function PreviousChats({ isDarkMode }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chats`, {
          params: { user_id: userId },
        });
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/chats/${chatId}`);
      setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleToggleFavourite = async (chatId, isFavourited) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/favourites/toggle`, {
        chat_id: chatId,
      });
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === chatId ? { ...chat, favourited: !isFavourited } : chat
        )
      );
    } catch (error) {
      console.error("Error toggling favourite status:", error);
    }
  };

  return (
    <div className={`previous-chats-wrapper ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="previous-chats-container">
        <h2 className="heading">Previous Chats</h2>
        <div className="chat-list">
          {chats.map((chat) => (
            <div key={chat._id} className="chat-card">
              <div className="chat-info" onClick={() => handleChatClick(chat._id)}>
                <h3 className="chat-title">{chat.chat_name || "Untitled Chat"}</h3>
                <p className="chat-summary">{chat.summary || "No summary available."}</p>
              </div>
              <div className="chat-actions">
                <button className="favourite-button" onClick={() => handleToggleFavourite(chat._id, chat.favourited)}>
                  {chat.favourited ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                </button>
                <button className="delete-button" onClick={() => handleDeleteChat(chat._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreviousChats;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/PreviousChats.css";

function PreviousChats() {
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

  const truncateSummary = (summary, maxLength = 50) => {
    if (!summary) return "No summary available.";
    return summary.length > maxLength ? `${summary.substring(0, maxLength)}...` : summary;
  };

  return (
    <div className="previous-chats-container">
      <h2 className="heading">Previous Chats</h2>
      <div className="chat-list">
        {chats.map((chat) => (
          <div key={chat._id} className="chat-card">
            <div className="chat-info" onClick={() => handleChatClick(chat._id)}>
              <h3 className="chat-title">{chat.chat_name || "Untitled Chat"}</h3>
              <p className="chat-summary">{truncateSummary(chat.summary)}</p>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteChat(chat._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PreviousChats;

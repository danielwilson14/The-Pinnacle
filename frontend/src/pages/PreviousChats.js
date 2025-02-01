import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
                console.log("Fetched chats:", response.data); // Log the fetched chats
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

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Previous Chats</h2>
            <ul style={styles.chatList}>
                {chats.map((chat) => (
                    <li key={chat._id} style={styles.chatItem}>
                        <button style={styles.chatButton} onClick={() => handleChatClick(chat._id)}>
                            <strong>{chat.chat_name || "Untitled Chat"}</strong>
                            <p>{chat.summary}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    chatList: {
        listStyleType: "none",
        padding: 0,
    },
    chatItem: {
        marginBottom: "15px",
    },
    chatButton: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#f4f4f4",
        border: "1px solid #ccc",
        borderRadius: "8px",
        textAlign: "left",
        cursor: "pointer",
    },
};

export default PreviousChats;

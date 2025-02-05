import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBot from "../components/ChatBot";
import Navbar from "../components/Navbar"; // Import Navbar
import Modal from "react-modal";

Modal.setAppElement("#root");

function ChatPage() {
    const { chatId: routeChatId } = useParams(); // Get chatId from the route
    const [chatId, setChatId] = useState(routeChatId || null); // Track chatId state
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]); // Track chat messages
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChat = async () => {
            if (chatId) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/chats/${chatId}`);
                    console.log("Fetched chat:", res.data);

                    // Transform messages into the expected format
                    const transformedMessages = res.data.messages.map((msg) => ({
                        sender: msg.role === "user" ? "user" : "bot",
                        text: msg.content,
                    }));

                    setMessages(transformedMessages); // Update state with transformed messages
                } catch (error) {
                    console.error("Error fetching chat:", error);
                }
            } else {
                // Reset messages when starting a new chat
                setMessages([]);
            }
        };

        fetchChat();
    }, [chatId]);

    const sendMessage = async () => {
        console.log("Send button clicked with message:", message);

        if (!message.trim()) {
            console.log("Message is empty, not sending.");
            return;
        }

        const userId = localStorage.getItem("userId") || "anonymous";
        const payload = {
            user_id: userId,
            message,
            chat_id: chatId, // Attach the chatId if it exists
        };

        console.log("Payload being sent:", payload);

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, payload);
            console.log("Response from API:", res.data);

            const botResponse = res.data.assistant_reply;

            // If it's a new chat, set the chatId
            if (!chatId) {
                setChatId(res.data.chat_id);
                navigate(`/chat/${res.data.chat_id}`);
            }

            setMessages([
                ...messages,
                { sender: "user", text: message },
                { sender: "bot", text: botResponse },
            ]);

            setMessage(""); // Clear the input field
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div style={styles.pageContainer}>
            {/* Pass setChatId and setMessages to Navbar */}
            <Navbar setChatId={setChatId} setMessages={setMessages} />
            <div style={styles.chatContainer}>
                <ChatBot
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={modalStyles}
                contentLabel="Logout Confirmation"
            >
                <h2>Confirm Logout</h2>
                <p>Are you sure you want to log out?</p>
                <div style={styles.modalButtons}>
                    <button onClick={handleLogout} style={styles.confirmButton}>
                        Logout
                    </button>
                    <button onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </Modal>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: "flex",
        height: "100vh",
        backgroundColor: "#f4f4f4",
    },
    chatContainer: {
        width: "100%",
        padding: "20px",
    },
    modalButtons: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    confirmButton: {
        padding: "10px 20px",
        backgroundColor: "#6abf69",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#ccc",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

const modalStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#d7ede2",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
};

export default ChatPage;

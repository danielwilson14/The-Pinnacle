import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ setChatId, setMessages }) {
    const location = useLocation();
    const navigate = useNavigate();

    const hideNavbar = location.pathname === "/" || location.pathname === "/register";

    const handleNewChat = () => {
        if (location.pathname !== "/chat") {
            navigate("/chat"); // Navigate to the new chat page
        }
        setChatId(null); // Clear the chatId state
        setMessages([]); // Clear the messages from the chat
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear localStorage data
        navigate("/"); // Navigate to login page
    };

    if (hideNavbar) {
        return null;
    }

    return (
        <nav style={styles.navbar}>
            <button onClick={handleLogout} style={styles.link}>Logout</button>
            <button onClick={handleNewChat} style={styles.link}>New Chat</button>
            <Link to="/favourites" style={styles.link}>Favourites</Link>
            <Link to="/calendar" style={styles.link}>Calendar</Link>
            <Link to="/previous-chats" style={styles.link}>Previous Chats</Link>
        </nav>
    );
}

const styles = {
    navbar: {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: "200px",
        backgroundColor: "#ddd",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    },
    link: {
        margin: "10px 0",
        textDecoration: "none",
        color: "#000",
        fontSize: "18px",
        cursor: "pointer",
    },
};

export default Navbar;

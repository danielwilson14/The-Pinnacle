import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css"; // Import the new CSS file

function Navbar({ setChatId, setMessages }) {
    const location = useLocation();
    const navigate = useNavigate();

    const hideNavbar = location.pathname === "/" || location.pathname === "/register";

    const handleNewChat = () => {
        if (location.pathname !== "/chat") {
            navigate("/chat");
        }
        setChatId(null);
        setMessages([]);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    if (hideNavbar) {
        return null;
    }

    return (
        <nav className="navbar">
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleNewChat}>New Chat</button>
            <Link to="/favourites">Favourites</Link>
            <Link to="/calendar">Calendar</Link>
            <Link to="/previous-chats">Previous Chats</Link>
        </nav>
    );
}

export default Navbar;

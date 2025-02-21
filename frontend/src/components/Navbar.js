import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut, FiMessageCircle, FiHeart, FiCalendar, FiClock, FiHelpCircle } from "react-icons/fi";
import "../styles/Navbar.css";

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
            <Link to="/" onClick={handleLogout} className="nav-item">
                <FiLogOut className="nav-icon" /> Logout
            </Link>
            <Link to="/chat" onClick={handleNewChat} className="nav-item">
                <FiMessageCircle className="nav-icon" /> New Chat
            </Link>
            <Link to="/favourites" className="nav-item">
                <FiHeart className="nav-icon" /> Favourites
            </Link>
            <Link to="/calendar" className="nav-item">
                <FiCalendar className="nav-icon" /> Calendar
            </Link>
            <Link to="/previous-chats" className="nav-item">
                <FiClock className="nav-icon" /> Previous Chats
            </Link>
            <Link to="/professional-help" className="nav-item">
                <FiHelpCircle className="nav-icon" /> Professional Help
            </Link>
        </nav>
    );
}

export default Navbar;

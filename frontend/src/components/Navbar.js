import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.link}>Login</Link>
            <Link to="/chat" style={styles.link}>Chat</Link>
            <Link to="/favourites" style={styles.link}>Favourites</Link>
            <Link to="/calendar" style={styles.link}>Calendar</Link>
            <Link to="/previous-chats" style={styles.link}>Previous Chats</Link>
        </nav>
    );
}

const styles = {
    navbar: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: '200px',
        backgroundColor: '#ddd',
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
    },
    link: {
        margin: '10px 0',
        textDecoration: 'none',
        color: '#000',
        fontSize: '18px',
    },
};

export default Navbar;

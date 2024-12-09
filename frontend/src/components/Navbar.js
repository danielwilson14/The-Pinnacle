import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav style={{ padding: '10px', background: '#ddd' }}>
            <Link to="/">Login</Link> | <Link to="/chat">Chat</Link> | <Link to="/favourites">Favourites</Link> | <Link to="/calendar">Calendar</Link>
        </nav>
    );
}

export default Navbar;

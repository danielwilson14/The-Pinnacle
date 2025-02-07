import React from 'react';
import Navbar from './Navbar';
import ProfileIcon from './ProfileIcon';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
    const location = useLocation();
    const hideNavbar = location.pathname === '/' || location.pathname === '/register';

    return (
        <div style={styles.layout}>
            {!hideNavbar && <Navbar />} {/* Only show Navbar on certain pages */}
            {!hideNavbar && <ProfileIcon />} {/* Show ProfileIcon on pages with Navbar */}
            <div
                style={{
                    ...styles.content,
                    marginLeft: hideNavbar ? '0' : '200px', // Remove margin when Navbar is hidden
                }}
            >
                {children}
            </div>
        </div>
    );
}

const styles = {
    layout: {
        display: 'flex',
        height: '100vh',
    },
    content: {
        flex: 1, // Ensures the content takes the remaining space
        padding: '20px',
        overflowY: 'auto', // Enables scrolling for content if needed
        backgroundColor: '#f4f4f4',
    },
};

export default Layout;

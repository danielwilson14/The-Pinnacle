import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
    return (
        <div style={styles.layout}>
            <Navbar />
            <div style={styles.content}>
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
        flex: 1, // Ensures the content takes the remaining space next to the sidebar
        marginLeft: '200px', // Matches the width of the Navbar
        padding: '20px',
        overflowY: 'auto', // Enables scrolling for content if needed
        backgroundColor: '#f4f4f4',
    },
};

export default Layout;

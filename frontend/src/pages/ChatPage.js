import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBot from '../components/ChatBot';
import CalendarPage from '../pages/CalendarPage';
import Modal from 'react-modal'; 

Modal.setAppElement('#root');


function ChatPage() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState('chat'); // Track which view to display
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Fetch `userId` from localStorage


    const sendMessage = async () => {
        if (!message.trim()) return; // Prevent sending empty messages
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, { message });
            const botResponse = res.data.response;

            setMessages([
                ...messages,
                { sender: 'user', text: message },
                { sender: 'bot', text: botResponse },
            ]);
            setMessage(''); // Clear input after sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear local storage (or any session-related data)
        navigate('/'); // Redirect to login page
    };

    const handleNavigation = (path) => {
        navigate(path); // Navigate to other pages
    };

    return (
        <div style={styles.pageContainer}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <p onClick={() => handleNavigation('chat')} style={styles.sidebarItem}>New Chat</p>
                <p onClick={() => handleNavigation('favourites')} style={styles.sidebarItem}>Favourites</p>
                <p onClick={() => handleNavigation('calendar')} style={styles.sidebarItem}>Calendar</p>
                <p onClick={() => handleNavigation('help')} style={styles.sidebarItem}>Professional Help</p>
                <p onClick={() => handleNavigation('previous-chats')} style={styles.sidebarItem}>Previous Chats</p>
                <p onClick={() => handleNavigation('settings')} style={styles.sidebarItem}>Settings</p>
                <p onClick={() => setIsModalOpen(true)} style={styles.sidebarItem}>Logout</p>
            </div>

            {/* Chat area */}
            <div style={styles.chatContainer}>
                <ChatBot
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
                {currentView === 'calendar' && <CalendarPage userId={userId} />}
                {currentView === 'favourites' && <p>Favourites page coming soon!</p>}
                {currentView === 'help' && <p>Professional Help page coming soon!</p>}
                {currentView === 'previous-chats' && <p>Previous Chats page coming soon!</p>}
                {currentView === 'settings' && <p>Settings page coming soon!</p>}
            </div>

            {/* Logout Confirmation Modal */}
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
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f4f4f4',
    },
    sidebar: {
        width: '20%',
        backgroundColor: '#d7ede2',
        padding: '20px',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        fontWeight: 'bold',
    },
    sidebarItem: {
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
    },
    chatContainer: {
        width: '80%',
        padding: '20px',
    },
    modalButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    confirmButton: {
        padding: '10px 20px',
        backgroundColor: '#6abf69',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#d7ede2',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

export default ChatPage;

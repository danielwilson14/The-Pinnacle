import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import FavouritesPage from './pages/FavouritesPage';
import CalendarPage from './pages/CalendarPage';
import PreviousChats from './pages/PreviousChats';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/favourites" element={<FavouritesPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/previous-chats" element={<PreviousChats />} />
                    <Route path="/chat/:chatId" element={<ChatPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;

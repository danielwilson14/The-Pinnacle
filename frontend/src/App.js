import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import FavouritesPage from "./pages/FavouritesPage";
import CalendarPage from "./pages/CalendarPage";
import PreviousChats from "./pages/PreviousChats";
import ProfessionalHelpPage from "./pages/ProfessionalHelpPage";
import VerifyPage from "./pages/VerifyPage";
import FAQPage from "./pages/FAQPage";

function App() {
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    useEffect(() => {
        document.body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem("darkMode", isDarkMode);
    }, [isDarkMode]); 

    return (
        <Router>
            <Layout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/favourites" element={<FavouritesPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/previous-chats" element={<PreviousChats isDarkMode={isDarkMode} />} />
                    <Route path="/chat/:chatId" element={<ChatPage />} />
                    <Route path="/professional-help" element={<ProfessionalHelpPage />} />
                    <Route path="/verify/:token" element={<VerifyPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;

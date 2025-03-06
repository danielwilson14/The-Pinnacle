import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import ProfileIcon from "./ProfileIcon";
import VerificationBanner from "./Banner";
import { useLocation } from "react-router-dom";

function Layout({ children, isDarkMode, setIsDarkMode }) {
    const location = useLocation();
    const hideNavbar = location.pathname === "/" || location.pathname === "/register";
    const hideBanner = hideNavbar; // ✅ Hides the banner on login/register pages

    const [showBanner, setShowBanner] = useState(false);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;
    
        // ✅ Use localStorage instead of API
        const isVerified = localStorage.getItem("verified") === "true"; 
        setShowBanner(!isVerified);  // ✅ If verified, don't show banner
    
    }, [userId]);
    

    return (
        <div className={`layout ${isDarkMode ? "dark-mode" : ""}`} style={{ display: "flex", height: "100vh" }}>
            {!hideNavbar && <Navbar />}
            {!hideNavbar && (
                <div style={{ width: "250px", minWidth: "250px", height: "100vh", display: "flex", flexDirection: "column" }}>
                    <Navbar />
                    <ProfileIcon isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </div>
            )}

            <div
                className="content"
                style={{
                    color: isDarkMode ? "white" : "black",
                    width: "100%",
                    height: "100%",
                    padding: "0",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative", // ✅ Keeps banner inside the main content area
                }}
            >
                {/* ✅ Only show the banner if user is unverified AND not on login/register */}
                {!hideBanner && showBanner && <VerificationBanner />}

                {/* ✅ Adjust the chat container height so it doesn't overflow */}
                <div style={{
                    flexGrow: 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: showBanner ? "calc(100% - 40px)" : "100%", // ✅ Shrinks when banner is visible
                    transition: "height 0.3s ease",
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;

import React from "react";
import Navbar from "./Navbar";
import ProfileIcon from "./ProfileIcon";
import { useLocation } from "react-router-dom";

function Layout({ children, isDarkMode, setIsDarkMode }) {
    const location = useLocation();
    const hideNavbar = location.pathname === "/" || location.pathname === "/register";

    return (
        <div className={`layout ${isDarkMode ? "dark-mode" : ""}`} style={{ display: "flex", height: "100vh" }}>
            {!hideNavbar && <Navbar />}
            {!hideNavbar && <ProfileIcon isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
            
            {/* Fixing white strip issue by removing padding/margin and ensuring background color applies instantly */}
            <div
                className="content"
                style={{
                    marginLeft: hideNavbar ? "0" : "200px",
                    color: isDarkMode ? "white" : "black",
                    width: "100%",
                    height: "100vh",
                    padding: "0",
                    display: "flex",
                    flexDirection: "column",
                    transition: "background-color 0.3s ease, color 0.3s ease",
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default Layout;

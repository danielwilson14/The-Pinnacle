import React from 'react';
import '../styles/Banner.css'; // Ensure this file exists

const VerificationBanner = () => {
    const isVerified = localStorage.getItem("verified") === "true"; // ✅ Use stored value

    if (isVerified) return null; // ✅ Hide banner if user is verified

    return (
        <div className="verification-banner">
            <p>Verify your email to unlock all features! <a href="/verify">Click here</a> to verify.</p>
        </div>
    );
};

export default VerificationBanner;

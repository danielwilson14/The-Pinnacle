import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/verify-email/${token}`);
                setMessage(response.data.message);

                // Redirect to login page after 3 seconds
                setTimeout(() => navigate("/"), 3000);
            } catch (error) {
                setMessage("Invalid or expired verification link.");
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>{message}</h2>
            <p>You will be redirected shortly...</p>
        </div>
    );
};

export default VerifyPage;

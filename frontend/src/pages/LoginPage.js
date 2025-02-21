import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';  // Import CSS file

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
                email,
                password,
            });

            // Store JWT Token & User ID
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user_id);

            // Navigate to chat
            navigate("/chat");
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="page-container">
            <div className="form-container">
                <h2 className="title">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />
                <button onClick={handleLogin} className="button">
                    Login
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p className="register-text">
                    <a href="/register" className="link">Register?</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;

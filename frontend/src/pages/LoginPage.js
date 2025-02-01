import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


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
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleLogin} style={styles.button}>
                    <img
                        src="/Arrow.png"
                        alt="Arrow"
                        style={styles.arrowIcon}
                    />
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p style={styles.registerText}>
                    <a href="/register" style={styles.link}>Register?</a>
                </p>
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
    },
    formContainer: {
        backgroundColor: '#d7ede2',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '300px',
        textAlign: 'center',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#6abf69',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    arrowIcon: {
        width: '60px',
        height: '60px',
    },
    registerText: {
        marginTop: '15px',
    },
    link: {
        color: '#6abf69',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default LoginPage;

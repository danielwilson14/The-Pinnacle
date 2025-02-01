import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // Send registration request to backend
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, {
                email,
                password,
            });

            // If registration is successful
            if (response.status === 201) {
                alert('Registration successful!');
                navigate('/chat'); // Navigate to the chat page upon success
            }
        } catch (error) {
            // Handle errors from the backend
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Something went wrong.');
            } else {
                setError('Failed to connect to the server.');
            }
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Register</h2>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleRegister} style={styles.button}>
                    <img
                        src="/Arrow.png"
                        alt="Arrow"
                        style={styles.arrowIcon}
                    />
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p style={styles.loginText}>
                    Already a user? <a href="/" style={styles.link}>Login</a>
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
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowIcon: {
        width: '60px',
        height: '60px',
    },
    loginText: {
        marginTop: '15px',
    },
    link: {
        color: '#6abf69',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default RegisterPage;

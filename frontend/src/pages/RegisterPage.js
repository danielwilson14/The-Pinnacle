import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 🔒 Password Strength Checker
    const checkPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[\W]/.test(password)) strength += 1;

        if (strength <= 2) return "Weak";
        if (strength === 3) return "Medium";
        if (strength >= 4) return "Strong";
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordStrength(checkPasswordStrength(value));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (passwordStrength === "Weak") {
            setError("Your password is too weak. Please make it stronger.");
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, { email, password });
            alert("Registration successful! Please log in.");
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed.");
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Register</h2>
                <form onSubmit={handleRegister}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required style={styles.input} />
                    <span style={{ color: passwordStrength === "Weak" ? "red" : passwordStrength === "Medium" ? "orange" : "green", fontWeight: "bold" }}>
                        {passwordStrength}
                    </span>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={styles.input} />
                    {error && (
                        <div style={styles.errorBox}>
                            <p>{error}</p>
                        </div>
                    )}
                    <button type="submit" style={styles.button}>
                        <img src="/Arrow.png" alt="Arrow" style={styles.arrowIcon} />
                    </button>
                </form>
                <p style={styles.loginText}>
                    Already have an account? <a href="/" style={styles.link}>Login</a>
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
        width: '100vw',
        backgroundColor: '#f4f4f4',
        margin: 0,
        padding: 0,
        position: 'relative',
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
    loginText: {
        marginTop: '15px',
    },
    link: {
        color: '#6abf69',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    errorBox: {
        backgroundColor: "#ffe5e5",  
        color: "#d32f2f",  
        border: "1px solid #d32f2f",  
        borderRadius: "8px",
        padding: "10px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: "1.4",  
        marginTop: "10px",  
        maxWidth: "270px",  
        display: "block",  
    }
    
    
};

export default RegisterPage;

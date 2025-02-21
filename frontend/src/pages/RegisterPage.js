import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/RegisterPage.css';  // Import CSS file

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
        <div className="page-container">
            <div className="form-container">
                <h2 className="title">Register</h2>
                <form onSubmit={handleRegister}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
                    <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required className="input" />
                    <span className={`password-strength ${passwordStrength.toLowerCase()}`}>
                        {passwordStrength}
                    </span>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="input" />
                    {error && (
                        <div className="error-box">
                            <p>{error}</p>
                        </div>
                    )}
                    <button type="submit" className="button">
                        Register
                    </button>
                </form>
                <p className="login-text">
                    Already have an account? <a href="/" className="link">Login</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;

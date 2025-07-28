import React, { useState } from 'react';
import axios from '../../Api/Axios';
import { Link } from 'react-router-dom';
import './Sign_up.css';

function Sign_up() {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/student/register', userData);
            console.log('Registered:', response.data);
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className="signup-page">
            <h1 className="signup-title">Sign Up</h1>

            <form onSubmit={handleSignUpSubmit} className="signup-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="signup-button">Register</button>

                <p className="signin-link">
                    Already have an account?
                    <Link to="/sign_in"> Sign In</Link>
                </p>
            </form>

            <Link to="/" className="back-link">← Back to Home</Link>
        </div>
    );
}

export default Sign_up;

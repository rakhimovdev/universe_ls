import React, { useState } from 'react';
import axios from '../../Api/Axios';
import { Link } from 'react-router-dom';
import './Sign_in.css';

function Sign_in() {
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/login', loginData);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="signin-page">
            <h1 className="signin-title">Sign In</h1>

            <form onSubmit={handleLoginSubmit} className="signin-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="signin-button">Log In</button>

                <p className="signup-link">
                    Don't have an account?
                    <Link to="/sign_up"></Link>
                </p>
            </form>

            <Link to="/" className="back-link">← Back to Home</Link>
        </div>
    );
}

export default Sign_in;

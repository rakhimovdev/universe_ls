import React from "react";
import "./Navbar.css";

const Navbar = () => {
    // Agar token localStorage'da bo'lsa, foydalanuvchi login bo'lgan deb hisoblanadi
    const isLoggedIn = !!localStorage.getItem('token');

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div className="">
            <nav>
                <div className="in_nav">
                    <a href="/">
                        <div className="logo">
                            <h1>Logo</h1>
                        </div>
                    </a>
                    <ul>
                        <li>
                            <a href="/">Home</a>
                        </li>
                        <li>
                            <a href="/read">Reading</a>
                        </li>
                        <li>
                            <a href="#">Listening</a>
                        </li>
                        <li>
                            <a href="#">About Us</a>
                        </li>
                    </ul>
                    <div className="register">
                        {!isLoggedIn ? (
                            <>
                                <a href="/select_in">
                                    <button>Sign In</button>
                                </a>
                                <a href="/select">
                                    <button className="btn2">Sign Up</button>
                                </a>
                            </>
                        ) : (
                            <>
                                <a href="/account">
                                    <button>Account</button>
                                </a>
                                <button onClick={handleLogout} style={{ marginLeft: 10 }}>
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div >
    );
};

export default Navbar;



// sign in

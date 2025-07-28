import React, { useState } from "react";
import "./Navbar.css"

const Navbar = () => {


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
                        <a href="/select_in">
                            <button>Sign In</button>
                        </a>
                        <a href="/select">
                            <button className="btn2">Sign Up</button>
                        </a>
                    </div>
                </div>
            </nav>
        </div >
    );
};

export default Navbar;



// sign in 

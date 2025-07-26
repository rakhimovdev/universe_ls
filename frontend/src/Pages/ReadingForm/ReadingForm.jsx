import React from 'react'
import "./ReadingForm.css"
import { useState, useEffect } from 'react';
import { FaBars, FaClock } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function ReadingForm() {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen(!open);
    };


    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);

    const formatTime = (number) => {
        return number.toString().padStart(2, '0');
    };

    const hours = formatTime(time.getHours());
    const minutes = formatTime(time.getMinutes());
    const seconds = formatTime(time.getSeconds());
    return (
        <div className='readingform'>
            <header>
                <h1>logo</h1>
                <h1> <FaClock /> {`${hours}:${minutes}:${seconds}`}</h1>
                <div className="bar-icon" onClick={toggleDropdown}>
                    &#9776;
                </div>

                {open && (
                    <div className="dropdown-menu">
                        <button className="menu-item">Enter Focus Mode</button>
                        <Link to="/reading-tests" className="menu-item">All IELTS Reading Tests</Link>
                        <Link to="/" className="menu-item">Go to Homepage</Link>
                    </div>
                )}
            </header>
        </div>
    )
}

export default ReadingForm
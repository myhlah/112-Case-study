import React from 'react';
import './login.css'; // Make sure to import the CSS file for styling

const About = () => {
    return (
        <div className="about-container">
            <header className="header">
                <img src="/logorem.png" alt="Iligan City Traffic" className="logoA" />
                <p className="logo-textA">ILIGAN CITY TRAFFIC AND PARKING MANAGEMENT OFFICE</p>
                <nav className="navA">
                    <a href="/">Login</a>
                    <a href="/signup">Signup</a>
                </nav>
            </header>
            <h1>About Us</h1>
            <div className="about-row">
                <div className="about-text">
                    <p>
                        Welcome to the Iligan City Traffic and Parking Management Office. 
                        Our system is designed to streamline traffic and parking management in the city, 
                        ensuring a more organized and efficient experience for both residents and visitors.
                    </p>
                </div>
                <div className="about-image">
                    <img src="/photo1.jpg" alt="Traffic Management" />
                </div>
            </div>
            <div className="about-row">
                <div className="about-image">
                    <img src="/photo2.jpg" alt="Parking Management" />
                </div>
                <div className="about-text">
                    <p>
                        Our services include real-time traffic updates, parking availability, and a user-friendly 
                        interface for managing violations and payments.
                    </p>
                </div>
            </div>
            <div className="about-row">
                <div className="about-text">
                    <p>
                        We are committed to improving urban mobility and enhancing the quality of life in Iligan City.
                    </p>
                </div>
                <div className="about-image">
                    <img src="/photo3.jpg" alt="Urban Mobility" />
                </div>
            </div>
        </div>
    );
};

export default About;

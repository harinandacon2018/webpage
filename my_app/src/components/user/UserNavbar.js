import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./UserNavbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const UserNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="user-navbar">
      <div className="nav-container">
        <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
          <img src="/src/assets/images/logo2.png" alt="HN Constructions" className="logo" />
          <span className="logo-text">HN<span>Constructions</span></span>
        </Link>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
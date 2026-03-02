import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import './AdminNavbar.css';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <h3>Welcome, Admin</h3>
      </div>
      <div className="navbar-right">
        <button className="notification-btn">
          <FaBell />
          <span className="badge">3</span>
        </button>
        <div className="profile">
          <FaUserCircle size={30} />
          <span className="profile-name">Hari Nandan</span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
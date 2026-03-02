import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaImage, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminAuth"); // clear admin session
    navigate("/admin/login");              // redirect to login
  };

  return (
    <div className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{collapsed ? "HN" : "HN Admin"}</h2>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>

      <ul className="sidebar-menu">
        {/* Only Gallery link remains */}
        <li>
          <Link to="/admin/gallery">
            <span className="icon"><FaImage /></span>
            {!collapsed && <span className="text">Gallery</span>}
          </Link>
        </li>
      </ul>

      <div className="sidebar-footer">
        {/* Logout button – now functional */}
        <button onClick={handleLogout} className="logout-btn">
          <span className="icon"><FaSignOutAlt /></span>
          {!collapsed && <span className="text">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
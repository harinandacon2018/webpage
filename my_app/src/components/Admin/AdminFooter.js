import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import './AdminFooter.css';

const AdminFooter = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  return (
    <footer className="admin-footer">
      <div className="footer-content">
        <span className="copyright">&copy; 2026 HN Constructions Admin. All rights reserved.</span>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </footer>
  );
};

export default AdminFooter;
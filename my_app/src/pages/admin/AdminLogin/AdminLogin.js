import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { loginStep1, verifyOtp, otpSent } = useAuth();
  const navigate = useNavigate();

  const handleStep1 = (e) => {
    e.preventDefault();
    const success = loginStep1(email, password);
    if (!success) {
      setError('Invalid admin credentials');
    }
  };

  const handleOtp = (e) => {
    e.preventDefault();
    const success = verifyOtp(otp);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        {!otpSent ? (
          <form onSubmit={handleStep1}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-login">Next</button>
          </form>
        ) : (
          <form onSubmit={handleOtp}>
            <p>Enter the OTP sent to your email (demo: 123456)</p>
            <div className="form-group">
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-login">Verify OTP</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
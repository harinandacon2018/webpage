import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const ADMIN_EMAIL = 'harinandacon.2018@gmail.com';
  const ADMIN_PASSWORD = 'Admin@2024'; // Demo password

  const loginStep1 = (email, password) => {
    // Check if admin email with correct password
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate and send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);
      setTempEmail(email);
      setOtpSent(true);
      console.log('[DEV] Admin OTP:', otp);
      return true;
    }
    return false;
  };

  const verifyOtp = (otp) => {
    // Allow the generated OTP OR the demo OTP (123456) in development.
    // This makes the UI's "demo: 123456" copy actually usable during local testing.
    const demoOtp = '123456';
    const isDemoAllowed = process.env.NODE_ENV !== 'production';

    if (otp === generatedOtp || (isDemoAllowed && otp === demoOtp)) {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminEmail', tempEmail);
      setOtpSent(false);
      setGeneratedOtp('');
      setTempEmail('');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    setOtpSent(false);
  };

  return (
    <AuthContext.Provider value={{ loginStep1, verifyOtp, logout, otpSent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const navigate = useNavigate();
  const contactRef = useRef(null);
  const [highlightContact, setHighlightContact] = useState(false);

  const handleContactClick = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      contactRef.current.focus();
    }
    setHighlightContact(true);
    setTimeout(() => setHighlightContact(false), 3000);
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>HN<span style={{color: 'var(--secondary)'}}>Constructions</span></h3>
          <p>Building dreams since 2018. Excellence in residential and commercial construction.</p>
          <div className="social-links">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <button type="button" className="footer-link" onClick={() => navigate('/', { state: { scrollTo: 'about' } })}>About Us</button><br/>
          <button type="button" className="footer-link" onClick={() => navigate('/', { state: { scrollTo: 'services' } })}>Our Services</button><br/>
          <button type="button" className="footer-link" onClick={() => navigate('/projects')}>Projects</button><br/>  
          <button type="button" className="footer-link" onClick={handleContactClick}>Contact</button>
        </div>
        
        <div ref={contactRef} tabIndex="-1" className={`footer-section contact-section ${highlightContact ? 'highlight' : ''}`} aria-label="Contact information">
          <h4>Contact Info</h4>
          <p><i className="fas fa-map-marker-alt"></i> #128 1st cross Ranga Maruthi layout Magadi Main road Bangalore 560091</p>
          <p><i className="fas fa-phone"></i>+91 81399 25365</p>
          <p><i className="fas fa-phone"></i>+91 776051 5923</p>
          <p><i className="fas fa-envelope"></i> harinandacon.2018@gmail.com</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2018 HN Constructions. All rights reserved. | Designed with ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
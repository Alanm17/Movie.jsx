import React from "react";
import "./Footer.css";
import { FaGithub, FaLinkedin, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <p>
            <FaMapMarkerAlt className="icon" /> Seoul, South Korea
          </p>
          <p>
            <FaPhone className="icon" /> 010-3427-5553
          </p>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/Alanm17"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="social-icon" /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/alan-m1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="social-icon" /> LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

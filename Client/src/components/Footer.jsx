import React from "react";
import "./Footer.css";

const Footer = ({ onBookNowClick, page }) => {
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const phoneNumber = "6285814470914";
    const message = "Hi, I would like to inquire about your services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <footer className={`footer ${page === "home" ? "footer-home" : ""}`}>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <p>
                Jl. Uluwatu 2 no 6, Jimbaran
                <br />
                Kuta Selatan, Badung Bali, 80361
              </p>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p>hello@demalaya.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <a
                href="#"
                onClick={handleWhatsAppClick}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                +62 858 1447 0914
              </a>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <h3>Navigation</h3>
          <div className="quick-links">
            <a href="#" className="footer-link">
              <i className="fas fa-book"></i>
              <span>Booking Process</span>
            </a>
            <a href="#" className="footer-link">
              <i className="fas fa-file-alt"></i>
              <span>Terms and Conditions</span>
            </a>
            <a href="#" className="footer-link">
              <i className="fas fa-shield-alt"></i>
              <span>Policies</span>
            </a>
            <a href="#" className="footer-link" onClick={onBookNowClick}>
              <i className="fas fa-calendar-check"></i>
              Book Now
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <p className="copyright-text">
            © 2025 Demalaya Tour. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

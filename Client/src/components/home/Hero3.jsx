import { React, useEffect, useState } from "react";
import "./Hero3.css";
import pic1 from "../../assets/img/pic1.png";
import wa from "../../assets/img/wa.png";

function Hero3() {
  const handleInquireClick = (e) => {
    e.preventDefault();
    const phoneNumber = "6285814470914";
    const message =
      "Hi, I would like to inquire about custom travel itineraries.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="hero3-container">
      <div className="home-content2">
        <div className="content2-left">
          <div className="content2-image-wrapper">
            <div className="content2-card">
              <div className="card-content">
                <h3 className="card-title">
                  Your Dream Trip
                  <br />
                  Our Mission
                </h3>
                <h4 className="card-subtitle">
                  Custom Itineraries for Every Type of Traveler
                </h4>
                <ul className="traveler-types">
                  <li>
                    <span className="bullet">•</span>
                    Adventure Seekers: Trekking, diving, and exploration
                  </li>
                  <li>
                    <span className="bullet">•</span>
                    Family Vacations: Relaxation and fun for all ages
                  </li>
                  <li>
                    <span className="bullet">•</span>
                    Luxury Travelers: Exclusive experiences and accommodations
                  </li>
                </ul>
                <a
                  href="#"
                  className="inquire-link"
                  onClick={handleInquireClick}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="content2-right">
          <h2 className="content2-title">
            Explore
            <br />
            <span className="highlight">Indonesia</span>
          </h2>
          <h3 className="content2-subtitle">
            Discover Indonesia's Hidden Gems
          </h3>
          <div className="contact-expert">
            <div className="expert-text">
              <h4>Talk to the Travel Expert</h4>
            </div>
            <a
              href="#"
              className="whatsapp-button"
              onClick={handleInquireClick}
            >
              <img src={wa} alt="WhatsApp" className="wa-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero3;

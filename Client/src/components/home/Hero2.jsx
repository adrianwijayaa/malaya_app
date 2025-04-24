import React, { useEffect } from "react";
import image1 from "../../assets/img/image1.jpg";
import image2 from "../../assets/img/image2.jpg";
import image3 from "../../assets/img/image3.jpg";
import image4 from "../../assets/img/image4.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Hero2.css";
import { useNavigate, useLocation } from "react-router-dom";

function Hero2() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/about-us") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  const handleLearnMoreClick = (e) => {
    e.preventDefault();
    navigate("/about-us");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="hero2-container">
      <div className="home-content">
        <div className="home-content-left">
          <div className="content-text-wrapper">
            <h1 className="content-title">
              Your Gateway to <br />
              <span className="highlight">Unforgettable</span> <br />
              Indonesian Journeys
            </h1>
            <p className="content-description">
              Malaya Adventures specializes in creating bespoke travel
              experiences across Indonesia's vast and diverse destinations. From
              vibrant cultural encounters to serene natural escapes, we design
              trips that are as unique as you are.
            </p>
            <div className="content-cta">
              <a
                href="#"
                className="learn-more-btn"
                onClick={handleLearnMoreClick}
              >
                Learn More About Our Story
                <span className="btn-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
        <div className="home-content-right">
          <div className="image-grid">
            <img
              src={image1}
              alt="Indonesian culture"
              className="grid-image image-1"
            />
            <img
              src={image4}
              alt="Indonesian landscape"
              className="grid-image image-2"
            />
            <img
              src={image2}
              alt="Local experience"
              className="grid-image image-3"
            />
            <img
              src={image3}
              alt="Adventure activity"
              className="grid-image image-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero2;

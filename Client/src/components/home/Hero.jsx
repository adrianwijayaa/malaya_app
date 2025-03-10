import expedition from "../../assets/img/expedition.png";
import family from "../../assets/img/family.png";
import diving from "../../assets/img/diving.png";
import honeymoon from "../../assets/img/honeymoon.png";
import ship from "../../assets/img/ship.png";
import "../home/Hero.css";
import React from "react";

function Hero({ onBookNow }) {
  const handleInquireClick = () => {
    const phoneNumber = "6285814470914";
    const message = "Hi, I would like to inquire about Luxury Escape packages.";

    // Use wa.me format which is more reliable
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // For debugging
    console.log("WhatsApp URL:", whatsappUrl);

    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="hero-container">
      <div className="hero-text">
        Where <span>Extraordinary</span>
        <br />
        Journeys Await
      </div>

      <div className="hero-categories">
        <div className="hero-search">
          <span className="hero-search-icon">🔍</span>
          <input
            type="text"
            className="hero-search-input"
            placeholder="Search your dream destination ..."
          />
        </div>
        <div className="hero-book-now">
          <button className="hero-category5-book" onClick={onBookNow}>
            Book Now &gt;
          </button>
        </div>
        <div className="hero-category1 hero-category-card">
          <img
            className="hero-category-img"
            src={expedition}
            alt="expedition"
          />
          <h5 className="hero-category-text">Expeditions</h5>
        </div>

        <div className="hero-category2 hero-category-card">
          <img className="hero-category-img" src={family} alt="family" />
          <h5 className="hero-category-text">Family Vacations</h5>
        </div>

        <div className="hero-category3 hero-category-card">
          <img className="hero-category-img" src={diving} alt="diving" />
          <h5 className="hero-category-text">Diving Trips</h5>
        </div>

        <div className="hero-category4 hero-category-card">
          <img className="hero-category-img" src={honeymoon} alt="honeymoon" />
          <h5 className="hero-category-text">Honeymoon</h5>
        </div>

        <div className="hero-category5">
          <div className="hero-category5-div hero-category-card">
            <img className="hero-category-img" src={ship} alt="ship" />
            <h5 className="hero-category-text">Luxury Escape</h5>
          </div>
          <div className="hero-category5-content">
            <h5 className="hero-category5-title">
              For travelers seeking indulgence and comfort.
            </h5>
            <ul className="hero-category5-features">
              <li>
                Stay in exclusive resorts, private villas, or luxury
                liveaboards.
              </li>
              <li>Enjoy personalized services and VIP experiences.</li>
              <li>Dine on gourmet cuisine and unwind in serene settings.</li>
            </ul>
            <button
              className="hero-category5-inquire"
              onClick={handleInquireClick}
            >
              Inquire &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

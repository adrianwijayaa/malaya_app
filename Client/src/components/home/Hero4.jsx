import React from "react";
import "./Hero4.css";
import image1 from "../../assets/img/image1.jpg";
import image2 from "../../assets/img/image2.jpg";
import image3 from "../../assets/img/image3.jpg";
import image4 from "../../assets/img/image4.jpg";

function Hero4() {
  const handleInquireClick = (packageType) => (e) => {
    e.preventDefault();
    const phoneNumber = "6285814470914";
    const message = `Hi, I would like to inquire about ${packageType} package.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  return (
    <div className="hero4-container">
      <div className="card-pair-container">
        <div className="card-pair-container-div1">
          <div className="home-content3-img3">
            <img
              src={image1}
              alt="Adventure Expeditions - Komodo Island"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Adventure Expeditions - Scuba Diving"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Adventure Expeditions - Cultural Dance"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Adventure Expeditions - Local Experience"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content3-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content3-title">Adventure Expeditions</h2>
                <p className="home-content3-subtitle">
                  For thrill-seekers and nature lovers.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>Trek through pristine rainforests</li>
                  <li>Scale active volcanoes</li>
                  <li>Wildlife spotting expeditions</li>
                  <li>White water rafting adventures</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content3-button"
                  onClick={handleInquireClick("Adventure Expeditions")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-pair-container-div2">
          <div className="home-content4-img4">
            <img
              src={image1}
              alt="Cultural Journeys - Traditional Ceremony"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Cultural Journeys - Temple Visit"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Cultural Journeys - Local Crafts"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Cultural Journeys - Village Life"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content4-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content4-title">Cultural Journeys</h2>
                <p className="home-content4-subtitle">
                  Immerse yourself in Indonesia's rich heritage.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>Traditional ceremonies and rituals</li>
                  <li>Local art and craft workshops</li>
                  <li>Village life experiences</li>
                  <li>Ancient temple explorations</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content4-button"
                  onClick={handleInquireClick("Cultural Journeys")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-pair-container2">
        <div className="card-pair-container2-div1">
          <div className="home-content5-img5">
            <img
              src={image1}
              alt="Luxury Escapes - Villa View"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Luxury Escapes - Spa Treatment"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Luxury Escapes - Fine Dining"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Luxury Escapes - Private Pool"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content5-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content5-title">Luxury Escapes</h2>
                <p className="home-content5-subtitle">
                  For travelers seeking indulgence and comfort.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>5-star luxury resorts</li>
                  <li>Private villa experiences</li>
                  <li>Exclusive spa treatments</li>
                  <li>Fine dining experiences</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content5-button"
                  onClick={handleInquireClick("Luxury Escapes")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-pair-container2-div2">
          <div className="home-content6-img6">
            <img
              src={image1}
              alt="Family Vacations - Beach Activities"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Family Vacations - Water Park"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Family Vacations - Kids Club"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Family Vacations - Family Dinner"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content6-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content6-title">Family Vacations</h2>
                <p className="home-content6-subtitle">
                  For creating cherished memories with your loved ones.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>Kid-friendly activities</li>
                  <li>Educational experiences</li>
                  <li>Safe beach adventures</li>
                  <li>Family accommodation options</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content6-button"
                  onClick={handleInquireClick("Family Vacations")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-pair-container3">
        <div className="card-pair-container3-div1">
          <div className="home-content7-img7">
            <img
              src={image1}
              alt="Romantic Getaways - Sunset View"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Romantic Getaways - Couple Spa"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Romantic Getaways - Beach Dinner"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Romantic Getaways - Villa Interior"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content7-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content7-title">
                  Honeymoon & Romantic Getaways
                </h2>
                <p className="home-content7-subtitle">
                  Perfect for couples seeking intimate experiences.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>Romantic sunset dinners</li>
                  <li>Couple spa treatments</li>
                  <li>Private beach excursions</li>
                  <li>Intimate villa stays</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content7-button"
                  onClick={handleInquireClick("Honeymoon & Romantic Getaways")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-pair-container3-div2">
          <div className="home-content8-img8">
            <img
              src={image1}
              alt="Eco Travel - Nature Reserve"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Eco Travel - Local Community"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Eco Travel - Sustainable Practices"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Eco Travel - Wildlife"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content8-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content8-title">
                  Eco and Sustainable Travel
                </h2>
                <p className="home-content8-subtitle">
                  For conscious travelers who care about the planet.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>Eco-friendly accommodations</li>
                  <li>Conservation activities</li>
                  <li>Local community support</li>
                  <li>Sustainable practices</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content8-button"
                  onClick={handleInquireClick("Eco and Sustainable Travel")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-pair-container4">
        <div className="card-pair-container4-div1">
          <div className="home-content9-img9">
            <img
              src={image1}
              alt="Diving - Coral Reef"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Diving - Marine Life"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Diving - Equipment"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Diving - Beach"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content9-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content9-title">
                  Diving & Snorkeling Trips
                </h2>
                <p className="home-content9-subtitle">
                  For underwater enthusiasts.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>PADI certified courses</li>
                  <li>Reef exploration</li>
                  <li>Marine life encounters</li>
                  <li>Equipment rental</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content9-button"
                  onClick={handleInquireClick("Diving & Snorkeling Trips")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-pair-container4-div2">
          <div className="home-content10-img10">
            <img
              src={image1}
              alt="Island Hopping - Beach"
              style={{ borderRadius: "20px 0 0 0" }}
            />
            <img
              src={image4}
              alt="Island Hopping - Boat"
              style={{ borderRadius: "0 20px 0 0" }}
            />
            <img
              src={image3}
              alt="Island Hopping - Lagoon"
              style={{ borderRadius: "0 0 0 20px" }}
            />
            <img
              src={image2}
              alt="Island Hopping - Sunset"
              style={{ borderRadius: "0 0 20px 0" }}
            />
          </div>
          <div className="home-content10-card">
            <div className="card-content">
              <div className="card-header">
                <h2 className="home-content10-title">
                  Island Hopping Adventures
                </h2>
                <p className="home-content10-subtitle">
                  Experience the magic of Indonesia's diverse islands.
                </p>
              </div>
              <div className="card-details">
                <ul className="card-points">
                  <li>Multiple island visits</li>
                  <li>Beach exploration</li>
                  <li>Local island culture</li>
                  <li>Boat excursions</li>
                </ul>
              </div>
              <div className="card-footer">
                <a
                  href="#"
                  className="home-content10-button"
                  onClick={handleInquireClick("Island Hopping Adventures")}
                >
                  Inquire <span className="arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero4;

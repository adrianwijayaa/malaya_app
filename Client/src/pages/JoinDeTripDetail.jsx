import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import "./JoinDeTripDetail.css";

export default function JoinDeTripDetail() {
  const nav = useNavigate();
  const { tripId: id } = useParams();
  const [tripDetails, setTripDetails] = useState(null);
  const handleWA = () => {
    const phone = "62818520525"; // tanpa + dan spasi
    const msg = `Hi, I would like to join "${tripDetails.title}" on ${tripDetails.date}.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/join-trip/${id}`);
        setTripDetails(res.data.data);
      } catch (err) {
        console.error("Failed to fetch trip:", err);
      }
    };
    fetchTrip();
  }, [id]);

  if (!tripDetails) return <div>Loading...</div>;

  const quickFacts = [
    { label: "When", value: tripDetails.date },
    { label: "Where", value: tripDetails.location },
    { label: "Duration", value: tripDetails.duration },
    { label: "Group size", value: tripDetails.groupSize },
    { label: "Activity level", value: tripDetails.activityLevel },
  ];

  return (
    <div className="trip-detail">
      <section
        className="trip-hero"
        style={{
          backgroundImage: `url(${BASE_URL}${tripDetails.heroImage})`,
        }}
      >
        <div className="hero-overlay">
          <span className="hero-tag">Signature Journey</span>
          <h1>{tripDetails.title}</h1>
          <p className="hero-subtitle">{tripDetails.subtitle}</p>

          <div className="hero-meta">
            {quickFacts.map(
              (item) =>
                item.value && (
                  <div key={item.label} className="meta-item">
                    <span className="meta-label">{item.label}</span>
                    <span className="meta-value">{item.value}</span>
                  </div>
                )
            )}
          </div>
        </div>
      </section>

      <section className="trip-content">
        <div className="content-grid">
          <div className="content-main">
            <article className="card description-card">
              <h2>Overview</h2>
              <p>{tripDetails.description}</p>
            </article>

            <article className="card includes-card">
              <h2>What's Included</h2>
              <ul>
                {tripDetails.includes?.map((item) => (
                  <li key={item.id}>
                    <span className="include-icon" aria-hidden="true">
                      {"\u2713"}
                    </span>
                    <div className="include-copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <div className="card cta-card">
              <h2>Reserve Your Spot</h2>
              <p>
                Secure your place to explore {tripDetails.location} with our
                expert team. Our concierge will reach out within 24 hours.
              </p>
              <button className="btn-inquire" onClick={handleWA}>
                Inquire now
              </button>
            </div>
          </div>

          <aside className="content-sidebar" aria-label="Trip highlights">
            <div className="card highlight-card">
              <h2>Trip Highlights</h2>
              <div className="highlight-grid">
                {tripDetails.highlights?.map((highlight) => (
                  <div key={highlight.id} className="highlight-item">
                    <div className="highlight-media">
                      <img
                        src={`${BASE_URL}${highlight.imageUrl}`}
                        alt={highlight.text}
                      />
                    </div>
                    <p>{highlight.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

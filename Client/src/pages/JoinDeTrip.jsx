import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { BASE_URL } from "../api/axiosConfig";
import "./JoinDeTrip.css";
import backjointrip from "../assets/img/backjointrip.jpg";

export default function JoinDeTrip() {
  const nav = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/join-trips");
        setEntries((res.data || []).filter((t) => t.isActive));
      } catch (err) {
        console.error("Failed to fetch trips:", err);
      }
    };
    fetchTrips();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const open = (id) => nav(`/join-de-trip/${id}`);

  return (
    <div className="journal-spread">
      {/* ===== HEADER BARU ===== */}
      <header
        className="jdt-hero-dest"
        style={{ backgroundImage: `url(${backjointrip})` }}
      >
        <div className="jdt-hero-overlay" />
        <div className="jdt-hero-text">
          <h1>Join De Trip</h1>
          <p>
            Curated destinations across Indonesia — from mountain peaks to ocean
            depths, crafted for those who seek more than a journey.
          </p>
        </div>
      </header>

      {/* ===== GRID (tidak diubah) ===== */}
      <section className="js-grid">
        {entries.map((entry, index) => (
          <article
            key={entry.id}
            className={`js-item ${
              index % 6 === 0 || index % 6 === 6 ? "wide" : ""
            }`}
            onClick={() => open(entry.id)}
          >
            <div
              className="js-img"
              style={{
                backgroundImage: `url(${BASE_URL}${entry.heroImage})`,
              }}
            />
            <div className="js-meta">
              <small>{formatDate(entry.date)}</small>
              <h3>{entry.title}</h3>
              <p>{entry.subtitle || entry.description?.slice(0, 80)}</p>
              <button
                className="js-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  open(entry.id);
                }}
              >
                Join This Trip
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

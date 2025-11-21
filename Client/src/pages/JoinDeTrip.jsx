import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import "./JoinDeTrip.css";
import backjointrip from "../assets/img/backjointrip.jpg";

export default function JoinDeTrip() {
  const nav = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/join-trips");
        const rows = Array.isArray(res.data) ? res.data : [];
        // isActive ada di BE; tetap filter aman
        setEntries(rows.filter((t) => t.isActive));
      } catch (err) {
        // Jika 404 "No join trips found" → kosongkan list
        setEntries([]);
        console.error("Failed to fetch trips:", err);
      }
    };
    fetchTrips();
  }, []);

  const formatDate = (
    dateStr,
    opts = { day: "2-digit", month: "long", year: "numeric" }
  ) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("id-ID", opts);
  };

  const formatDateRange = (start, end) => {
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;
    if (!s && !e) return "";
    if (s && !e) return formatDate(start);
    if (!s && e) return formatDate(end);

    // Keduanya ada
    const sameDay = s.toDateString() === e.toDateString();
    if (sameDay) return formatDate(start);

    const sameMonthYear =
      s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    if (sameMonthYear) {
      // 10 – 12 Januari 2026
      return `${s.toLocaleDateString("id-ID", {
        day: "2-digit",
      })}–${e.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`;
    }
    // 28 Des 2025 – 02 Jan 2026
    return `${s.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })} – ${e.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  };

  const imgUrl = (path) => {
    if (!path) return "";
    return path.startsWith("/uploads") ? `${BASE_URL}${path}` : path;
  };

  const open = (id) => nav(`/signature-journey/${id}`);

  return (
    <div className="journal-spread">
      {/* ===== HEADER ===== */}
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

      {/* ===== GRID ===== */}
      <section className="js-grid">
        {entries.map((entry, index) => (
          <article
            key={entry.id}
            className={`js-item ${index % 6 === 0 ? "wide" : ""}`}
            onClick={() => open(entry.id)}
          >
            <div
              className="js-img"
              style={{
                backgroundImage: `url(${imgUrl(entry.heroImage)})`,
              }}
            />
            <div className="js-meta">
              {(entry.startDate || entry.endDate) && (
                <small>{formatDateRange(entry.startDate, entry.endDate)}</small>
              )}
              <h3>{entry.title}</h3>
              <p>
                {entry.subtitle ||
                  (entry.description
                    ? `${entry.description.slice(0, 80)}…`
                    : "")}
              </p>
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

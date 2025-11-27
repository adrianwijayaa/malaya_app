import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import "./JoinDeTripDetail.css";

export default function JoinDeTripDetail() {
  const nav = useNavigate();
  const { tripId: id } = useParams();
  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get(`/join-trip/${id}`);
        setTripDetails(res.data?.data || null);
      } catch (err) {
        console.error("Failed to fetch trip:", err);
      }
    };
    fetchTrip();
  }, [id]);

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

    const sameDay = s.toDateString() === e.toDateString();
    if (sameDay) return formatDate(start);

    const sameMonthYear =
      s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    if (sameMonthYear) {
      return `${s.toLocaleDateString("id-ID", {
        day: "2-digit",
      })}–${e.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`;
    }
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
    if (/^https?:\/\//i.test(path)) return path;
    const base = BASE_URL?.replace(/\/+$/, "") || "";
    const imgPath = String(path).startsWith("/") ? path : `/${path}`;
    return `${base}${imgPath}`;
  };

  const formatMoney = (
    val,
    currency = "USD",
    locale = "en-US",
    maxFrac = 2
  ) => {
    const num = Number(String(val).replace(/[^\d.-]/g, ""));
    return Number.isFinite(num)
      ? num.toLocaleString(locale, {
          style: "currency",
          currency,
          maximumFractionDigits: maxFrac,
        })
      : String(val);
  };

  const sorter = (a, b) => {
    const sa = Number.isFinite(+a?.sortOrder) ? +a.sortOrder : 0;
    const sb = Number.isFinite(+b?.sortOrder) ? +b.sortOrder : 0;
    return sa - sb;
    // jika sama, biarkan stabil
  };

  const quickFacts = useMemo(() => {
    if (!tripDetails) return [];
    return [
      {
        label: "When",
        value: formatDateRange(tripDetails.startDate, tripDetails.endDate),
      },
      { label: "Where", value: tripDetails.location },
      { label: "Duration", value: tripDetails.duration },
      { label: "Group size", value: tripDetails.groupSize },
      { label: "Activity level", value: tripDetails.activityLevel },
    ].filter((i) => i.value);
  }, [tripDetails]);

  const handleWA = () => {
    if (!tripDetails) return;
    const phone = "62818520525";
    const when = formatDateRange(tripDetails.startDate, tripDetails.endDate);
    const msg = `Hi, I would like to join "${tripDetails.title}"${
      when ? ` on ${when}` : ""
    }.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  if (!tripDetails) return <div className="trip-loading">Loading...</div>;

  const highlights = [...(tripDetails.highlights || [])].sort(sorter);
  const includes = [...(tripDetails.includes || [])].sort(sorter);
  const excludes = [...(tripDetails.excludes || [])].sort(sorter);
  const priceDetails = [...(tripDetails.priceDetails || [])].sort(sorter);

  return (
    <div className="trip-detail">
      <section
        className="trip-hero"
        style={{
          backgroundImage: `url(${imgUrl(tripDetails.heroImage)})`,
        }}
      >
        <div className="hero-overlay">
          <span className="hero-tag">Signature Journey</span>
          <h1>{tripDetails.title}</h1>
          {tripDetails.subtitle && (
            <p className="hero-subtitle">{tripDetails.subtitle}</p>
          )}

          <div className="hero-meta">
            {quickFacts.map((item) => (
              <div key={item.label} className="meta-item">
                <span className="meta-label">{item.label}</span>
                <span className="meta-value">{item.value}</span>
              </div>
            ))}
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

            {!!includes.length && (
              <article className="card includes-card">
                <h2>What's Included</h2>
                <ul>
                  {includes.map((item) => (
                    <li key={item.id}>
                      <span className="include-icon" aria-hidden="true">
                        {"\u2713"}
                      </span>
                      <div className="include-copy">
                        <h3>{item.title}</h3>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {!!excludes.length && (
              <article className="card excludes-card">
                <h2>What's Not Included</h2>
                <ul>
                  {excludes.map((item) => (
                    <li key={item.id}>
                      <span className="exclude-icon" aria-hidden="true">
                        {"\u2715"}
                      </span>
                      <div className="exclude-copy">
                        <h3>{item.label}</h3>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {!!priceDetails.length && (
              <article className="card price-card">
                <h2>Pricing</h2>
                <div className="jdt-price-table">
                  <div className="jdt-price-header">
                    <div className="jdt-price-cell">No</div>
                    <div className="jdt-price-cell">Pax</div>
                    <div className="jdt-price-cell">Price</div>
                  </div>
                  <div className="jdt-price-body">
                    {priceDetails.map((row, idx) => (
                      <div className="jdt-price-row" key={row.id}>
                        <div className="jdt-price-cell">{idx + 1}</div>
                        <div className="jdt-price-cell">{row.pax}</div>
                        <div className="jdt-price-cell jdt-price-amount">
                          {formatMoney(row.price, "USD", "en-US", 2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            )}

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
            {!!highlights.length && (
              <div className="card highlight-card">
                <h2>Trip Highlights</h2>
                <div className="highlight-grid">
                  {highlights.map((highlight) => (
                    <div key={highlight.id} className="highlight-item">
                      <div className="highlight-media">
                        <img
                          src={imgUrl(highlight.imageUrl)}
                          alt={highlight.text}
                          loading="lazy"
                        />
                      </div>
                      <p>{highlight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

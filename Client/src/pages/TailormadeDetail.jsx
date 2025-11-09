import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Badge, Image } from "react-bootstrap";
import { useParams, useLocation, Navigate } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import "./TailormadeDetail.css";

const TailormadeDetail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [trip, setTrip] = useState(location.state?.trip || null);
  const [loading, setLoading] = useState(!location.state?.trip);

  const handleWA = () => {
    const phone = "62818520525"; // tanpa + dan tanpa spasi
    const msg = `Hi, I would like to inquire about "${trip.title}".`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await api.get("/tailor-trips");
        const found = res.data.find(
          (t) =>
            t.slug
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") === slug
        );
        if (found) setTrip(found);
      } catch (err) {
        console.error("Failed to fetch trip:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!trip) fetchTrip();
  }, [slug, trip]);

  if (loading)
    return <div className="tmdet-loading">Loading trip details...</div>;
  if (!trip) return <Navigate to="/tailor-made" replace />;

  const heroImage = trip.heroImage?.startsWith("/uploads")
    ? `${BASE_URL}${trip.heroImage}`
    : trip.heroImage;

  return (
    <div className="tmdet editorial">
      {/* ===== HERO ===== */}
      <section
        className="tmdet-hero"
        style={{ backgroundImage: `url("${heroImage}")` }}
        aria-label={`Hero image for ${trip.title}`}
      >
        <div className="tmdet-hero-overlay" />
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <header className="tmdet-hero-frame">
                <div className="tmdet-eyebrow">Tailor-Made Journey</div>
                <h1 className="tmdet-title">
                  <span className="tmdet-title-line">{trip.title}</span>
                </h1>
                <div className="tmdet-meta">
                  <span className="tmdet-chip">
                    Best Season&nbsp;&middot;&nbsp;
                    <strong>
                      {trip.bestSeasonStart} – {trip.bestSeasonEnd}
                    </strong>
                  </span>
                  <span className="tmdet-dot" aria-hidden="true">
                    •
                  </span>
                  <span className="tmdet-chip">
                    Ideal For&nbsp;&middot;&nbsp;
                    <strong>
                      {trip.idealPaxMin}–{trip.idealPaxMax} pax
                    </strong>
                  </span>
                  <span className="tmdet-dot" aria-hidden="true">
                    •
                  </span>
                  <span className="tmdet-chip">
                    Pace&nbsp;&middot;&nbsp;<strong>{trip.pace}</strong>
                  </span>
                </div>
              </header>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== BODY ===== */}
      <section className="tmdet-body">
        <Container>
          <Row className="gx-5 gy-4">
            {/* Main */}
            <Col lg={8} as="main">
              <figure className="tmdet-lead-media">
                <img src={heroImage} alt={trip.title} />
                <figcaption>{trip.title}</figcaption>
              </figure>

              <article className="tmdet-article-card">
                <h2 className="tmdet-h">Overview</h2>
                <p className="tmdet-p">{trip.overview}</p>
              </article>

              {/* Highlights */}
              {trip.highlights?.length > 0 && (
                <section className="tmdet-section-card">
                  <div className="tmdet-section-head">
                    <h3 className="tmdet-h">Highlights</h3>
                    <Badge bg="light" text="dark" className="tmdet-badge">
                      {trip.highlights.length} curated spots
                    </Badge>
                  </div>

                  <div className="tmdet-masonry">
                    {trip.highlights.map((h) => {
                      const hImg = h.imageUrl?.startsWith("/uploads")
                        ? `${BASE_URL}${h.imageUrl}`
                        : h.imageUrl;
                      return (
                        <figure className="tmdet-masonry-item" key={h.id}>
                          <Image
                            src={hImg}
                            alt={h.caption}
                            loading="lazy"
                            className="tmdet-masonry-img"
                            rounded
                          />
                          <figcaption>{h.caption}</figcaption>
                        </figure>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Includes */}
              {trip.includes?.length > 0 && (
                <section className="tmdet-section-card">
                  <h3 className="tmdet-h">What’s Included</h3>
                  <ul className="tmdet-list">
                    {trip.includes.map((inc) => (
                      <li key={inc.id} className="tmdet-list-item">
                        {inc.label}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </Col>

            {/* Aside */}
            <Col lg={4} as="aside">
              <div className="tmdet-sticky">
                <div className="tmdet-cta-card">
                  <div className="tmdet-cta-head">
                    <span className="tmdet-cta-eyebrow">Plan With Us</span>
                    <h4 className="tmdet-cta-title">Customize this journey</h4>
                  </div>
                  <p className="tmdet-cta-copy">
                    Kirim preferensi (tanggal, durasi, budget, minat). Kurator
                    perjalanan kami akan menyesuaikan itinerary yang selaras
                    dengan gaya Anda.
                  </p>
                  <Button className="tmdet-cta-btn" onClick={handleWA}>
                    Inquire &nbsp;→
                  </Button>
                </div>

                {/* Facts */}
                {trip.facts?.length > 0 && (
                  <div className="tmdet-facts">
                    {trip.facts.map((f) => (
                      <div className="tmdet-fact-row" key={f.id}>
                        <span>{f.key}</span>
                        <strong>{f.value}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div className="tmdet-note-card">
                  <p>
                    Ingin nuansa <em>honeymoon</em> atau family-friendly? Tulis
                    catatan khusus saat mengirim inquiry—kami sesuaikan tempo,
                    aktivitas, dan pilihan properti.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default TailormadeDetail;

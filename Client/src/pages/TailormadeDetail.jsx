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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!trip) {
      fetchTripBySlug();
    }
  }, [slug, trip]);

  const fetchTripBySlug = async () => {
    try {
      const response = await api.get("/tailor-trips");
      const foundTrip = response.data.find((t) => {
        const tripSlug = t.slug
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        return tripSlug === slug;
      });

      if (foundTrip) {
        setTrip(foundTrip);
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("/uploads")
      ? `${BASE_URL}${imagePath}`
      : imagePath;
  };

  const handleWhatsAppInquiry = () => {
    const phoneNumber = "62818520525";
    const message = `Hi, I would like to inquire about "${trip.title}".`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // === NEW: currency formatter for Pricing table (USD) ===
  const formatMoney = (val, currency = "USD", locale = "en-US") => {
    const num = Number(String(val).replace(/[^\d.-]/g, ""));
    return Number.isFinite(num)
      ? num.toLocaleString(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : String(val);
  };

  if (loading) {
    return (
      <div className="tmdet-loading">
        <p>Loading trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return <Navigate to="/tailor-made" replace />;
  }

  const heroImageUrl = getImageUrl(trip.heroImage);

  return (
    <div className="tmdet editorial">
      {/* Hero Section */}
      <section
        className="tmdet-hero"
        style={{ backgroundImage: `url("${heroImageUrl}")` }}
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
                  {trip.bestSeasonStart && trip.bestSeasonEnd && (
                    <>
                      <span className="tmdet-chip">
                        Best Season&nbsp;&middot;&nbsp;
                        <strong>
                          {trip.bestSeasonStart} – {trip.bestSeasonEnd}
                        </strong>
                      </span>
                      <span className="tmdet-dot" aria-hidden="true">
                        •
                      </span>
                    </>
                  )}
                  {trip.idealPaxMin && trip.idealPaxMax && (
                    <>
                      <span className="tmdet-chip">
                        Ideal For&nbsp;&middot;&nbsp;
                        <strong>
                          {trip.idealPaxMin}–{trip.idealPaxMax} pax
                        </strong>
                      </span>
                      <span className="tmdet-dot" aria-hidden="true">
                        •
                      </span>
                    </>
                  )}
                  {trip.pace && (
                    <span className="tmdet-chip">
                      Pace&nbsp;&middot;&nbsp;<strong>{trip.pace}</strong>
                    </span>
                  )}
                </div>
              </header>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Body Content */}
      <section className="tmdet-body">
        <Container>
          <Row className="gx-5 gy-4">
            {/* Main Content */}
            <Col lg={8} as="main">
              <figure className="tmdet-lead-media">
                <img src={heroImageUrl} alt={trip.title} />
                <figcaption>{trip.title}</figcaption>
              </figure>

              {/* Overview */}
              <article className="tmdet-article-card">
                <h2 className="tmdet-h">Overview</h2>
                <p className="tmdet-p">{trip.overview}</p>
              </article>

              {/* Highlights */}
              {trip.highlights && trip.highlights.length > 0 && (
                <section className="tmdet-section-card">
                  <div className="tmdet-section-head">
                    <h3 className="tmdet-h">Highlights</h3>
                    <Badge bg="light" text="dark" className="tmdet-badge">
                      {trip.highlights.length} curated spots
                    </Badge>
                  </div>

                  <div className="tmdet-masonry">
                    {trip.highlights.map((highlight) => {
                      const highlightImageUrl = getImageUrl(highlight.imageUrl);
                      return (
                        <figure
                          className="tmdet-masonry-item"
                          key={highlight.id}
                        >
                          <Image
                            src={highlightImageUrl}
                            alt={highlight.caption || "Highlight image"}
                            loading="lazy"
                            className="tmdet-masonry-img"
                            rounded
                          />
                          {highlight.caption && (
                            <figcaption>{highlight.caption}</figcaption>
                          )}
                        </figure>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* What's Included */}
              {trip.includes && trip.includes.length > 0 && (
                <section className="tmdet-section-card">
                  <h3 className="tmdet-h">What's Included</h3>
                  <ul className="tmdet-list">
                    {trip.includes.map((include) => (
                      <li key={include.id} className="tmdet-list-item">
                        {include.label}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* What's Excluded */}
              {trip.excludes && trip.excludes.length > 0 && (
                <section className="tmdet-section-card">
                  <h3 className="tmdet-h">What's Excluded</h3>
                  <ul className="tmdet-list tmdet-list-exclude">
                    {trip.excludes.map((exclude) => (
                      <li key={exclude.id} className="tmdet-list-item-exclude">
                        {exclude.label}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Price Details */}
              {trip.priceDetails && trip.priceDetails.length > 0 && (
                <section className="tmdet-section-card">
                  <h3 className="tmdet-h">Pricing Guide</h3>
                  <div className="tmdet-price-table">
                    <div className="tmdet-price-header">
                      <div className="tmdet-price-cell">No</div>
                      <div className="tmdet-price-cell">Pax</div>
                      <div className="tmdet-price-cell">Price</div>
                    </div>
                    <div className="tmdet-price-body">
                      {trip.priceDetails.map((priceDetail, index) => (
                        <div key={priceDetail.id} className="tmdet-price-row">
                          <div className="tmdet-price-cell">{index + 1}</div>
                          <div className="tmdet-price-cell">
                            {priceDetail.pax}
                          </div>
                          <div className="tmdet-price-cell tmdet-price-amount">
                            {formatMoney(priceDetail.price, "USD", "en-US")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </Col>

            {/* Sidebar */}
            <Col lg={4} as="aside" className="tmdet-sidebar-col">
              <div className="tmdet-sticky">
                {/* CTA Card */}
                <div className="tmdet-cta-card">
                  <div className="tmdet-cta-head">
                    <span className="tmdet-cta-eyebrow">Plan With Us</span>
                    <h4 className="tmdet-cta-title">Customize this journey</h4>
                  </div>
                  <p className="tmdet-cta-copy">
                    Share your preferences for dates, duration, budget, and
                    interests. Our travel curators will tailor an itinerary that
                    aligns with your style.
                  </p>
                  <Button
                    className="tmdet-cta-btn"
                    onClick={handleWhatsAppInquiry}
                  >
                    Inquire &nbsp;→
                  </Button>
                </div>

                {/* Trip Facts */}
                {trip.facts && trip.facts.length > 0 && (
                  <div className="tmdet-facts">
                    {trip.facts.map((fact) => (
                      <div className="tmdet-fact-row" key={fact.id}>
                        <span>{fact.key}</span>
                        <strong>{fact.value}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {/* Note Card */}
                <div className="tmdet-note-card">
                  <p>
                    Want a honeymoon vibe or family-friendly experience? Share
                    your special requests when sending your inquiry—we'll adjust
                    the pace, activities, and property choices accordingly.
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

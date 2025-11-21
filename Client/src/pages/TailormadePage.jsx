import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { BASE_URL } from "../api/axiosConfig";
import heroImg from "../assets/img/tailorHero.jpg";
import "./TailorMadePage.css";

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const TailormadePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await api.get("/tailor-trips");
      const activeTrips = response.data.filter((trip) => trip.isActive);
      setTrips(activeTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
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

  return (
    <div className="tailormade-page">
      {/* Hero Section */}
      <header
        className="tmslim-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="tmslim-overlay"></div>
        <div className="tmslim-content">
          <h1 className="tmslim-title">
            Craft your signature journey through{" "}
            <span className="tmslim-highlight">Indonesia</span>
          </h1>
          <p className="tmslim-subtext">
            From sunrise treks in volcanic highlands to candlelit dinners over
            jade waters, our travel designers build itineraries that mirror the
            way you love to explore.
          </p>
          <div className="tmslim-actions">
            <Button
              as={Link}
              to="#tailor-collection"
              className="tmslim-btn-primary"
            >
              Start Planning
            </Button>
            <Button
              as={Link}
              to="#tailor-collection"
              variant="link"
              className="tmslim-btn-secondary"
            >
              Browse Journeys
            </Button>
          </div>
        </div>
        <div className="tmslim-scrollcue">
          <span className="tmslim-scrolltext">Scroll to explore</span>
          <div className="tmslim-mouse">
            <div className="tmslim-wheel"></div>
          </div>
        </div>
      </header>

      {/* Trip Collection Section */}
      <section className="tailor-collection" id="tailor-collection">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <span className="section-pill">Curated for you</span>
              <h2 className="section-heading">Tailormade Trip</h2>
              <p className="section-description">
                Begin with a blueprint, then collaborate with our design studio
                to personalise the rhythm, accommodations, and exclusive access
                that fit your travel cadence.
              </p>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <p>Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-5">
              <p>No trips available at the moment.</p>
            </div>
          ) : (
            <Row className="g-4">
              {trips.map((trip) => {
                const slug = createSlug(trip.slug || trip.title);
                const imageUrl = getImageUrl(trip.heroImage);

                return (
                  <Col md={6} lg={4} key={trip.id}>
                    <article className="trip-card">
                      <div
                        className="trip-visual"
                        style={{ backgroundImage: `url("${imageUrl}")` }}
                        role="img"
                        aria-label={trip.title}
                      />
                      <div className="trip-body">
                        {trip.pace && (
                          <div className="trip-chip">{trip.pace}</div>
                        )}
                        <h3 className="trip-heading">{trip.title}</h3>
                        <p className="trip-summary">{trip.overview}</p>

                        <div className="trip-meta">
                          {trip.bestSeasonStart && trip.bestSeasonEnd && (
                            <span>
                              {trip.bestSeasonStart} - {trip.bestSeasonEnd}
                            </span>
                          )}
                          {trip.idealPaxMin && trip.idealPaxMax && (
                            <span>
                              {trip.idealPaxMin}–{trip.idealPaxMax} pax
                            </span>
                          )}
                        </div>

                        <Button
                          as={Link}
                          to={`/open-trip/${slug}`}
                          state={{ trip }}
                          className="trip-cta"
                        >
                          View Journey
                        </Button>
                      </div>
                    </article>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
};

export default TailormadePage;

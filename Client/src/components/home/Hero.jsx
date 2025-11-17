// Hero.jsx — News slider fetches from API (same pattern as News.jsx)
// Keeps: interest dropdown + WhatsApp button + "Design My Trip" CTA
// Categories now link to TailorMade page

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import expedition from "../../assets/img/expedition.png";
import family from "../../assets/img/family.png";
import divingIcon from "../../assets/img/diving.png";
import honeymoon from "../../assets/img/honeymoon.png";
import ship from "../../assets/img/ship.png";

import api, { BASE_URL } from "../../api/axiosConfig";
import "./Hero.css";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d || "";
  }
}

function imageSrc(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = (BASE_URL || "").replace(/\/+$/, "");
  const path = String(url).startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
}
function excerpt(htmlOrText, max = 110) {
  const text = String(htmlOrText ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max
    ? text.slice(0, max).replace(/[,.;:!?]?\s+\S*$/, "") + "…"
    : text;
}

function Hero({ onBookNow }) {
  const swiperRef = useRef(null);

  // ===== Fetch news (active only), newest first
  const [loading, setLoading] = useState(true);
  const [newsErr, setNewsErr] = useState("");
  const [newsAll, setNewsAll] = useState([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setNewsErr("");
        const res = await api.get("/news", {
          params: { status: "active", sort: "date", order: "DESC" },
        });
        if (!alive) return;
        setNewsAll(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        if (!alive) return;
        setNewsErr("Failed to load news.");
        setNewsAll([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const items = useMemo(() => {
    const arr = [...newsAll];
    arr.sort(
      (a, b) =>
        new Date(b?.date || "1970-01-01") - new Date(a?.date || "1970-01-01")
    );
    return arr.slice(0, 10); // limit for hero
  }, [newsAll]);

  // Track current category from fetched item (fallback to "All")
  const [currentCat, setCurrentCat] = useState("All");
  const handleSlideSync = (sw) => {
    const idx = sw?.realIndex ?? 0;
    const it = items[idx];
    setCurrentCat((it?.category || "All").trim() || "All");
  };

  // ===== Controls: interest dropdown + WA + "Design My Trip"
  const INTERESTS = [
    "Expeditions",
    "Family Vacations",
    "Diving Trips",
    "Honeymoon",
    "Luxury Cruises",
  ];
  const [interest, setInterest] = useState(INTERESTS[0]);

  const handleWA = () => {
    const phoneNumber = "62818520525";
    const msg = `Hi, I’m interested in ${interest}.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="ma-hero" aria-label="Malaya Adventures hero">
      <div className="ma-hero__gradient" aria-hidden="true" />
      <div className="ma-hero__noise" aria-hidden="true" />

      <div className="ma-hero__top ma-hero__container">
        {/* LEFT */}
        <div className="ma-hero__left">
          <h1 className="ma-hero__title ma-hero__reveal">
            Where <span>Extraordinary</span>
            <br />
            Journeys Await
          </h1>

          <p
            className="ma-hero__sub ma-hero__reveal"
            style={{ animationDelay: "80ms" }}
          >
            Tailor-made expeditions, luxury cruises, and unforgettable family
            adventures across Indonesia.
          </p>

          <div
            className="ma-hero__controls ma-hero__glass ma-hero__reveal"
            style={{ animationDelay: "160ms" }}
          >
            <div className="ma-hero__selectWrap">
              <label className="ma-hero__sr" htmlFor="ma-hero-interest">
                I’m interested in
              </label>
              <select
                id="ma-hero-interest"
                className="ma-hero__select"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                aria-label="I'm interested in"
              >
                {INTERESTS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="ma-hero__btnWA"
              onClick={handleWA}
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
            >
              Chat on WhatsApp
              <span className="ma-hero__btnWAIcon" aria-hidden="true">
                💬
              </span>
            </button>

            <button className="ma-hero__btnPrimary" onClick={onBookNow}>
              Design My Trip{" "}
              <span className="ma-hero__btnPrimaryIcon" aria-hidden="true">
                ✈️
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT - NEWS SLIDER (fetched) */}
        <aside className="ma-hero__right" aria-label="Latest news">
          <div className="ma-hero__sliderWrap ma-hero__glass">
            <Link
              to={
                currentCat && currentCat !== "All"
                  ? `/news?cat=${encodeURIComponent(currentCat)}`
                  : "/news"
              }
              className="ma-hero__allNews"
              aria-label={
                currentCat && currentCat !== "All"
                  ? `View all ${currentCat}`
                  : "View all news"
              }
              title={
                currentCat && currentCat !== "All"
                  ? `View all ${currentCat}`
                  : "View all news"
              }
            >
              View all
            </Link>

            {loading ? (
              <div className="ma-hero__overlay" aria-live="polite">
                Loading…
              </div>
            ) : newsErr ? (
              <div className="ma-hero__overlay" aria-live="polite">
                {newsErr}
              </div>
            ) : items.length === 0 ? (
              <div className="ma-hero__overlay" aria-live="polite">
                No articles yet.
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation]}
                loop
                slidesPerView={1}
                spaceBetween={0}
                speed={750}
                navigation
                autoplay={{
                  delay: 2500,
                  pauseOnMouseEnter: true,
                  disableOnInteraction: false,
                }}
                preventClicks={false}
                preventClicksPropagation={false}
                className="ma-hero__swiper"
                onSwiper={(sw) => {
                  swiperRef.current = sw;
                  handleSlideSync(sw);
                }}
                onSlideChange={handleSlideSync}
              >
                {items.map((it, idx) => (
                  <SwiperSlide
                    key={`${it.slug || idx}`}
                    aria-label={`${it.category || "News"} • ${it.title}`}
                  >
                    <article
                      className="ma-hero__news"
                      style={{
                        backgroundImage: `url(${imageSrc(it.imageUrl)})`,
                      }}
                      role="article"
                    >
                      <div className="ma-hero__badge">Latest</div>

                      <div className="ma-hero__overlay">
                        <div className="ma-hero__meta">
                          <span className="ma-hero__chip">
                            {it.category || "News"}
                          </span>
                          <span className="ma-hero__dot" aria-hidden="true" />
                          <time dateTime={it.date}>{formatDate(it.date)}</time>
                          {it.readTime ? (
                            <>
                              <span
                                className="ma-hero__dot"
                                aria-hidden="true"
                              />
                              <span>{it.readTime} min read</span>
                            </>
                          ) : null}
                        </div>
                        <h2 className="ma-hero__newsTitle" title={it.title}>
                          {it.title}
                        </h2>
                        {it.desc ?? it.description ?? it.body ? (
                          <p className="ma-hero__newsDesc">
                            {excerpt(it.desc ?? it.description ?? it.body, 110)}
                          </p>
                        ) : null}
                        <Link
                          to={`/news/${it.slug}`}
                          className="ma-hero__btnGhost"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Read: ${it.title}`}
                        >
                          Read News
                        </Link>
                      </div>
                    </article>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </aside>
      </div>

      {/* CATEGORIES (now link to TailorMade page) */}
      <div className="ma-hero__categories ma-hero__container" role="list">
        <div className="ma-hero__catWrap">
          <Link
            to="/tailor-made"
            className="ma-hero__catCard ma-hero__glass"
            role="listitem"
            aria-label="Browse Expeditions"
          >
            <img className="ma-hero__catImg" src={expedition} alt="" />
            <span className="ma-hero__catText">Expeditions</span>
          </Link>
        </div>
        <div className="ma-hero__catWrap">
          <Link
            to="/tailor-made"
            className="ma-hero__catCard ma-hero__glass"
            role="listitem"
            aria-label="Browse Family Vacations"
          >
            <img className="ma-hero__catImg" src={family} alt="" />
            <span className="ma-hero__catText">Family Vacations</span>
          </Link>
        </div>
        <div className="ma-hero__catWrap">
          <Link
            to="/tailor-made"
            className="ma-hero__catCard ma-hero__glass"
            role="listitem"
            aria-label="Browse Diving Trips"
          >
            <img className="ma-hero__catImg" src={divingIcon} alt="" />
            <span className="ma-hero__catText">Diving Trips</span>
          </Link>
        </div>
        <div className="ma-hero__catWrap">
          <Link
            to="/tailor-made"
            className="ma-hero__catCard ma-hero__glass"
            role="listitem"
            aria-label="Browse Honeymoon"
          >
            <img className="ma-hero__catImg" src={honeymoon} alt="" />
            <span className="ma-hero__catText">Honeymoon</span>
          </Link>
        </div>
        <div className="ma-hero__catWrap">
          <Link
            to="/tailor-made"
            className="ma-hero__catCard ma-hero__glass"
            role="listitem"
            aria-label="Browse Luxury Cruises"
          >
            <img className="ma-hero__catImg" src={ship} alt="" />
            <span className="ma-hero__catText">Luxury Cruises</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import React, { useEffect, useState } from "react";
import "./Hero4.css";
import api, { BASE_URL } from "../../api/axiosConfig";
import LazyImage from "../LazyImage";

const Hero4 = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/tailor-trips");
        const active = (res.data || []).filter((t) => t.isActive);
        setTrips(active);
      } catch (err) {
        console.error("Failed to fetch tailor trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const fullBox = { width: "100%", height: "100%" };

  const getHeroUrl = (trip) => {
    const src = trip?.heroImage || "";
    if (!src) return "";
    return src.startsWith("/uploads") ? `${BASE_URL}${src}` : src;
  };

  const getHighlightUrls = (trip) => {
    const fromHL =
      trip?.highlights
        ?.slice(0, 4)
        .map((h) =>
          h?.imageUrl
            ? h.imageUrl.startsWith("/uploads")
              ? `${BASE_URL}${h.imageUrl}`
              : h.imageUrl
            : null
        ) || [];

    // fallback jika kurang dari 4
    const hero = getHeroUrl(trip);
    const out = [...fromHL];
    while (out.length < 4) out.push(hero || fromHL[0] || hero);
    return out.slice(0, 4);
  };

  const getIncludes = (trip) =>
    (trip?.includes || [])
      .slice(0, 4)
      .map((inc) => inc?.label)
      .filter(Boolean);

  const trimOverview = (s = "", max = 160) => {
    const t = String(s).trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return `${cut.slice(0, lastSpace > 80 ? lastSpace : max)}…`;
    // jaga biar potongannya rapi (hindari memotong di tengah kata)
  };

  const handleInquireClick = (title) => (e) => {
    e.preventDefault();
    const phoneNumber = "62818520525";
    const message = `Hi, I would like to inquire about ${title} package.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // Mapping kelas per blok agar layout & CSS lama tetap kepakai
  const blockClassMap = [
    // pair 1
    {
      imgClass: "home-content3-img3",
      cardClass: "home-content3-card",
      titleClass: "home-content3-title",
      subtitleClass: "home-content3-subtitle",
      btnClass: "home-content3-button",
    },
    {
      imgClass: "home-content4-img4",
      cardClass: "home-content4-card",
      titleClass: "home-content4-title",
      subtitleClass: "home-content4-subtitle",
      btnClass: "home-content4-button",
    },
    // pair 2
    {
      imgClass: "home-content5-img5",
      cardClass: "home-content5-card",
      titleClass: "home-content5-title",
      subtitleClass: "home-content5-subtitle",
      btnClass: "home-content5-button",
    },
    {
      imgClass: "home-content6-img6",
      cardClass: "home-content6-card",
      titleClass: "home-content6-title",
      subtitleClass: "home-content6-subtitle",
      btnClass: "home-content6-button",
    },
    // pair 3
    {
      imgClass: "home-content7-img7",
      cardClass: "home-content7-card",
      titleClass: "home-content7-title",
      subtitleClass: "home-content7-subtitle",
      btnClass: "home-content7-button",
    },
    {
      imgClass: "home-content8-img8",
      cardClass: "home-content8-card",
      titleClass: "home-content8-title",
      subtitleClass: "home-content8-subtitle",
      btnClass: "home-content8-button",
    },
    // pair 4
    {
      imgClass: "home-content9-img9",
      cardClass: "home-content9-card",
      titleClass: "home-content9-title",
      subtitleClass: "home-content9-subtitle",
      btnClass: "home-content9-button",
    },
    {
      imgClass: "home-content10-img10",
      cardClass: "home-content10-card",
      titleClass: "home-content10-title",
      subtitleClass: "home-content10-subtitle",
      btnClass: "home-content10-button",
    },
  ];

  // Bungkus per pair agar class container2/3/4 tetap sama
  const pairContainerClasses = [
    "card-pair-container",
    "card-pair-container2",
    "card-pair-container3",
    "card-pair-container4",
  ];

  // Render satu blok kartu (grid 4 gambar + card teks + WA)
  const renderBlock = (trip, classMeta) => {
    const imgs = getHighlightUrls(trip);
    const bullets = getIncludes(trip);

    // sudut border mengikuti versi statis kamu
    const radii = ["20px 0 0 0", "0 20px 0 0", "0 0 0 20px", "0 0 20px 0"];

    return (
      <>
        <div className={classMeta.imgClass}>
          {imgs.map((src, i) => (
            <LazyImage
              key={i}
              src={src}
              alt={`${trip.title} - image ${i + 1}`}
              style={{ ...fullBox, borderRadius: radii[i] }}
            />
          ))}
        </div>

        <div className={classMeta.cardClass}>
          <div className="card-content">
            <div className="card-header">
              <h2 className={classMeta.titleClass}>{trip.title}</h2>
              <p className={classMeta.subtitleClass}>
                {trimOverview(trip.overview, 160)}
              </p>
            </div>

            {bullets.length > 0 && (
              <div className="card-details">
                <ul className="card-points">
                  {bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card-footer">
              <a
                href="#"
                className={classMeta.btnClass}
                onClick={handleInquireClick(trip.title)}
              >
                Inquire <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (loading) return null;

  // Ambil maksimal 8 trip aktif supaya persis seperti jumlah blok di Hero4 statis
  const items = trips.slice(0, blockClassMap.length);

  // Kelompokkan per 2 item untuk masuk ke container pair-1..4
  const pairs = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }

  return (
    <div className="hero4-container hero-sheen2">
      {pairs.map((pair, pairIdx) => {
        const containerCls =
          pairContainerClasses[pairIdx] || "card-pair-container";
        return (
          <div className={containerCls} key={`pair-${pairIdx}`}>
            {pair.map((trip, j) => {
              const bm = blockClassMap[pairIdx * 2 + j];
              // wrap kiri/kanan agar sesuai DOM lama (div1 / div2)
              const sideWrapClass =
                containerCls + (j === 0 ? "-div1" : "-div2");
              return (
                <div
                  className={sideWrapClass}
                  key={trip.id || `${pairIdx}-${j}`}
                >
                  {renderBlock(trip, bm)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Hero4;

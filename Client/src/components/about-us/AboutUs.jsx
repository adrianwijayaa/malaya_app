import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  // Tetap pakai konten lama (tidak diubah), bisa tambahkan "photo" jika nanti ada file gambar
  const team = [
    {
      name: "De Malaya",
      role: "Founder, CEO & Indonesia Travel Expert",
      description:
        "Malaya's deep love for Indonesia's diverse landscapes and cultures led her to establish De Malaya Tour. With years of experience in the travel industry, she brings a unique vision to each journey we create. Her dedication to responsible tourism and creating meaningful experiences is the driving force behind our company.",
      photo: "", // isi URL jika ada
    },
    {
      name: "Sonia",
      role: "Travel Specialist",
      description:
        "Sonia's extensive knowledge of Indonesia's hidden gems ensures that every itinerary he crafts is a true adventure. With a passion for connecting travelers to the heart of Indonesia, Sonia's attention to detail and personalized approach create unforgettable experiences.",
      photo: "",
    },
    {
      name: "Dicky",
      role: "Cultural Experience Curator",
      description:
        "Dicky is our cultural connoisseur, curating immersive experiences that allow travelers to truly understand Indonesia's heritage. His insights into local traditions, ceremonies, and cuisine enrich your journey with authenticity and depth.",
      photo: "",
    },
    {
      name: "Teguh",
      role: "Customer Relations Manager",
      description:
        "Teguh's warm and friendly demeanor ensures that every aspect of your journey is seamless and enjoyable. His dedication to exceptional customer service guarantees that your experience with De Malaya Tour exceeds your expectations.",
      photo: "",
    },
    {
      name: "Ayu",
      role: "Sustainable Tourism Advocate",
      description:
        "Ayu is our advocate for responsible and sustainable tourism. With a background in environmental science, she works tirelessly to ensure that our journeys have a positive impact on both local communities and the environment.",
      photo: "",
    },
    {
      name: "Rama",
      role: "Adventure Expert",
      description:
        "Rama's adventurous spirit and expertise in outdoor activities make him the go-to person for thrill-seekers. Whether it's trekking, diving, or exploring the wilderness, Rama's passion for adventure ensures that your journey is exhilarating and safe.",
      photo: "",
    },
  ];

  return (
    <div className="auv about-wrap">
      {/* HERO */}
      <section className="auv-hero">
        <div className="auv-heroInner">
          <h1 className="auv-title">
            Crafting Extraordinary Indonesian Journeys
          </h1>
          <p className="auv-sub">
            Discover the heart of Indonesia through immersive experiences
            designed by passionate travel experts
          </p>

          <div className="auv-ctaRow">
            <a
              href="mailto:hello@malayaadventures.com"
              className="auv-btn auv-btnPrimary"
            >
              Contact Us
            </a>
            <a
              href="https://wa.me/+62818520525?text=Hello%20Malaya%20Adventures%2C%20I%27d%20like%20to%20inquire%20about%20your%20travel%20packages."
              className="auv-btn auv-btnGhost"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="auv-section">
        <div className="auv-container">
          <div className="auv-card auv-intro">
            <p>
              At Malaya Adventures, we redefine travel by offering unparalleled
              journeys through the breathtaking landscapes and diverse cultures
              of Indonesia. Our commitment to creating transformative
              experiences ensures every journey becomes an unforgettable story.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="auv-section">
        <div className="auv-container">
          <header className="auv-secHead">
            <span className="auv-pill">Our Mission</span>
            <h2 className="auv-h2">Purpose & Promise</h2>
          </header>
          <div className="auv-card auv-intro">
            <p>
              We curate immersive journeys that enable travelers to not just
              witness but truly experience the beauty, heritage, and
              authenticity of Indonesia. Every itinerary is crafted to create
              lasting memories that resonate with the soul.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM (vertical cards with big photo) */}
      <section className="auv-section">
        <div className="auv-container">
          <header className="auv-secHead">
            <span className="auv-pill">Our Team</span>
            <h2 className="auv-h2">People Behind The Journey</h2>
          </header>

          <div className="auv-teamGrid">
            {team.map((m, i) => (
              <article className="auv-teamCard" key={i}>
                {/* Header Photo / Large Avatar */}
                {m.photo ? (
                  <div
                    className="auv-teamPhoto"
                    style={{ backgroundImage: `url(${m.photo})` }}
                  />
                ) : (
                  <div className="auv-teamAvatar" aria-label={m.name}>
                    <div className="auv-avatarBadge">
                      {m.name?.charAt(0) || "M"}
                    </div>
                  </div>
                )}

                {/* Body */}
                <div className="auv-teamBody">
                  <h3 className="auv-name">{m.name}</h3>
                  <p className="auv-role">{m.role}</p>
                  <p className="auv-desc">{m.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="auv-section auv-sectionTight">
        <div className="auv-container">
          <div className="auv-ctaCard">
            <div className="auv-ctaCopy">
              <h3>Start Your Journey</h3>
              <p>
                Ready to explore Indonesia? Our team is here to craft your
                perfect adventure.
              </p>
            </div>
            <div className="auv-ctaActions">
              <a
                href="mailto:hello@malayaadventures.com"
                className="auv-btn auv-btnPrimary"
              >
                Contact Us
              </a>
              <a
                href="https://wa.me/+62818520525?text=Hello%20Malaya%20Adventures%2C%20I%27d%20like%20to%20inquire%20about%20your%20travel%20packages."
                className="auv-btn auv-btnGhost"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

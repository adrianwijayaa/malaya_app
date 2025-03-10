import React, { useState } from "react";
import "./AboutUs.css";

const AboutUs = () => {
  const team = [
    {
      name: "De Malaya",
      role: "Founder, CEO & Indonesia Travel Expert",
      description:
        "Malaya's deep love for Indonesia's diverse landscapes and cultures led her to establish De Malaya Tour. With years of experience in the travel industry, she brings a unique vision to each journey we create. Her dedication to responsible tourism and creating meaningful experiences is the driving force behind our company.",
    },
    {
      name: "Sonia",
      role: "Travel Specialist",
      description:
        "Sonia's extensive knowledge of Indonesia's hidden gems ensures that every itinerary he crafts is a true adventure. With a passion for connecting travelers to the heart of Indonesia, Sonia's attention to detail and personalized approach create unforgettable experiences.",
    },
    {
      name: "Dicky",
      role: "Cultural Experience Curator",
      description:
        "Dicky is our cultural connoisseur, curating immersive experiences that allow travelers to truly understand Indonesia's heritage. His insights into local traditions, ceremonies, and cuisine enrich your journey with authenticity and depth.",
    },
    {
      name: "Teguh",
      role: "Customer Relations Manager",
      description:
        "Teguh's warm and friendly demeanor ensures that every aspect of your journey is seamless and enjoyable. His dedication to exceptional customer service guarantees that your experience with De Malaya Tour exceeds your expectations.",
    },
    {
      name: "Ayu",
      role: "Sustainable Tourism Advocate",
      description:
        "Ayu is our advocate for responsible and sustainable tourism. With a background in environmental science, she works tirelessly to ensure that our journeys have a positive impact on both local communities and the environment.",
    },
    {
      name: "Rama",
      role: "Adventure Expert",
      description:
        "Rama's adventurous spirit and expertise in outdoor activities make him the go-to person for thrill-seekers. Whether it's trekking, diving, or exploring the wilderness, Rama's passion for adventure ensures that your journey is exhilarating and safe.",
    },
  ];

  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>Crafting Extraordinary Indonesian Journeys</h1>
        <p className="hero-subtitle">
          Discover the heart of Indonesia through immersive experiences designed
          by passionate travel experts
        </p>
      </div>
      <div className="about-content">
        <div className="about-section">
          <div className="section-card">
            <p>
              At De Malaya Tour, we redefine travel by offering unparalleled
              journeys through the breathtaking landscapes and diverse cultures
              of Indonesia. Our commitment to creating transformative
              experiences ensures every journey becomes an unforgettable story.
            </p>
          </div>
        </div>

        <div className="about-section">
          <h2>Our Mission</h2>
          <div className="section-card">
            <p>
              We curate immersive journeys that enable travelers to not just
              witness but truly experience the beauty, heritage, and
              authenticity of Indonesia. Every itinerary is crafted to create
              lasting memories that resonate with the soul.
            </p>
          </div>
        </div>

        <div className="about-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-member-image">
                  <div className="member-placeholder-image">
                    {member.name[0]}
                  </div>
                </div>
                <div className="team-member-info">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="about-section contact-section">
          <h2>Start Your Journey</h2>
          <p>
            Ready to explore Indonesia? Our team is here to craft your perfect
            adventure.
          </p>
          <div className="contact-buttons">
            <a
              href="mailto:info@demalayatour.com"
              className="contact-button email-button"
            >
              <i className="fas fa-envelope"></i>
              Contact Us
            </a>
            <a
              href="https://wa.me/yourphonenumber"
              className="contact-button whatsapp-button"
            >
              <i class="fab fa-whatsapp"></i>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

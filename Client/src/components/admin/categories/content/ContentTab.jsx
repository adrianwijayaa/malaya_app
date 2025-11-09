// src/pages/admin/categories/content/ContentTab.jsx
import React, { useState } from "react";
import TailormadeTripTab from "./TailormadeTripTab";
import JoindetripTab from "./JoindetripTab";
import NewsContent from "./NewsContent";
import "./ContentTab.css";

const ContentTab = () => {
  const [activeContent, setActiveContent] = useState("tailormade");

  return (
    <div className="content-tab">
      <h3>
        <i className="fas fa-pen-nib"></i> Content Management
      </h3>

      {/* 🔹 Switch antar sub-kategori */}
      <div className="content-tabs">
        <button
          className={`content-btn ${
            activeContent === "tailormade" ? "active" : ""
          }`}
          onClick={() => setActiveContent("tailormade")}
          type="button"
        >
          Tailormade Trip
        </button>

        <button
          className={`content-btn ${
            activeContent === "joindetrip" ? "active" : ""
          }`}
          onClick={() => setActiveContent("joindetrip")}
          type="button"
        >
          Join de Trip
        </button>

        <button
          className={`content-btn ${activeContent === "news" ? "active" : ""}`}
          onClick={() => setActiveContent("news")}
          type="button"
        >
          News
        </button>
      </div>

      {/* 🔹 Render kategori aktif */}
      <div className="content-inner">
        {activeContent === "tailormade" && <TailormadeTripTab />}

        {activeContent === "joindetrip" && <JoindetripTab />}

        {activeContent === "news" && <NewsContent />}
      </div>
    </div>
  );
};

export default ContentTab;

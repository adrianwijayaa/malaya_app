import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-compass">
          <div className="compass-ring"></div>
          <div className="compass-center"></div>
          <div className="compass-arrow"></div>
        </div>
        <div className="loading-logo">
          <span>M</span>
          <span>A</span>
          <span>L</span>
          <span>A</span>
          <span>Y</span>
          <span>A</span>
        </div>
        <div className="loading-tagline">www.malayaadventures.com</div>
        <div className="loading-tagline">under the maintainance</div>
        <div className="loading-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
      <div className="loading-mountains">
        <div className="mountain"></div>
        <div className="mountain"></div>
        <div className="mountain"></div>
      </div>
    </div>
  );
};

export default Loading;

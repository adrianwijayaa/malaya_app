import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* Animated Waves */}
        <div className="loading-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>

        {/* Main Logo */}
        <div className="loading-logo">
          <span>M</span>
          <span>A</span>
          <span>L</span>
          <span>A</span>
          <span>Y</span>
          <span>A</span>
        </div>

        {/* Subtitle */}
        <div className="loading-subtitle">Adventures Await</div>

        {/* Website URL */}
        <div className="loading-url">www.malayaadventures.com</div>

        {/* Loading Dots Animation */}
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="loading-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
    </div>
  );
};

export default Loading;

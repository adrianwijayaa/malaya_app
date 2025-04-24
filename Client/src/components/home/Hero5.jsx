import React from "react";
import Carousel from "./Carousel";
import "./Hero5.css";

function Hero5() {
  return (
    <div className="hero5-container">
      {" "}
      <div className="home-content11">
        <div className="home-content11-container">
          <div className="home-content11-left">
            <h2 className="home-content11-title">
              Why Choose <br />
              <span>Malaya</span> <br />
              Adventures?
            </h2>
            <p className="home-content11-subtitle">
              At Malaya Adventures, we believe every journey should be
              extraordinary. Discover why travelers consistently choose us for
              their Indonesian adventures.
            </p>
          </div>
          <div className="home-content11-right">
            <Carousel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero5;

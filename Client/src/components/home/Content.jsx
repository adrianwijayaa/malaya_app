import React, { useState, useEffect } from "react";
import pic1 from "../../assets/img/pic1.png";
import wa from "../../assets/img/wa.png";
import Carousel from "../home/Carousel";
import background2 from "../../assets/img/background2.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "../home/Content.css";
import Hero2 from "./Hero2";
import Hero3 from "./Hero3";
import Hero4 from "./Hero4";
import Hero5 from "./Hero5";
import Hero6 from "./Hero6";

const Content = () => {
  return (
    <div className="content-container">
      <Hero2 />
      <Hero3 />
      <Hero4 />
      <Hero5 />
      <Hero6 />
    </div>
  );
};

export default Content;

import React from "react";
import Hero from "./Hero";
import Content from "./Content";

const Home = ({ onBookNowClick }) => {
  return (
    <>
      <Hero onBookNow={onBookNowClick} />
      <Content />
    </>
  );
};

export default Home;

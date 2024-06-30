import React from "react";
import "./hero.css";
import arrow_icon from "../Assets/arrow.png";
import hero_image from "../Assets/hero_image.png";

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-left">
        <h2>BROWSE</h2>
        <div>
          <div className="hero-hand-icon">
            <p>New</p>
          </div>
          <p>Collections</p>
          <p>For <span>everyone</span></p>
        </div>
        <div className="hero-latest-button">
          <div>Latest </div>
          <img src={arrow_icon} alt="" />
        </div>
      </div>
      <div className="hero-right">
        <img src={hero_image} alt="" />
      </div>
    </div>
  );
};

export default Hero;

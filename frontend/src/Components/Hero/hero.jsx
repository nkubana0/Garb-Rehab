import React from "react";
import { Link } from "react-router-dom";
import "./hero.css";
import arrow_icon from "../Assets/arrow.png";

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
        <Link to="/mens" className="hero-latest-button" style={{textDecoration : 'none'}}>
          <div>Latest </div>
          <img src={arrow_icon} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default Hero;

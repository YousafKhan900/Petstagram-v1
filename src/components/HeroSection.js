import React from "react";
import "../css/App.css";
import { Button } from "./Button";
import "../css/HeroSection.css";

function HeroSection() {
  return (
    <div className="hero-container">
      {/* <video src="/videos/video-2.mp4" autoPlay loop muted /> */}
      <h1>Welcome to Petstagram</h1>
      <p>Share your pet's life</p>
      <div className="hero-btns">
        <Button
          to={"/sign-up"}
          className="btns"
          buttonStyle="btn--outline"
          buttonSize="btn--large"
        >
          Sign Up
        </Button>
        <Button
          className="btns"
          buttonStyle="btn--primary"
          buttonSize="btn--large"
        >
          Watch Trailer <i className="far fa-play-circle" />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;

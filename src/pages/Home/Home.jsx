import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import ParticleBackground from "../../components/Particle Background/ParticleBackground";
import heroImg from "../../Assets/hero.webp"; // <-- put your image here

const Home = () => {
  const navigator = useNavigate()
  return (
    <div className="sf-root">
      <ParticleBackground />

      <div className="sf-hero">
        {/* Left content */}
        <div className="sf-hero-left">
          <div className="sf-badge">
            <span className="sf-badge-dot">⚡</span>
            <span>AI-Powered Analysis</span>
          </div>

          <h1 className="sf-title">
            Welcome to
            <br />
            <span className="sf-gradient-text">SkillForge</span>
          </h1>

          <p className="sf-subtext">
            Transform your career with AI-powered resume analysis. Get instant
            insights, skill assessments, and personalized recommendations to
            stand out.
          </p>

          <button className="sf-cta" onClick={()=> {
            navigator('/analysis')
          }}>
            <span>Upload Resume → Analyze Skills</span>
          </button>
        </div>

        {/* Right content */}
        <div className="sf-hero-right">
          <div className="sf-accuracy-chip">99% Accuracy</div>

          <div className="sf-card">
            <img src={heroImg} alt="AI brain on chip" className="sf-card-img" />
            <div className="sf-card-chip sf-chip">AI-Powered</div>
          </div>
        </div>
      </div>
      <footer className="generator-note">
  <p>The analysis will be generated using the Gemini Free Tier Model.</p>
</footer>
    </div>
  );
};

export default Home;

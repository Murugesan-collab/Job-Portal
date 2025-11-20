import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Dream Job Today</h1>
          <p>Connect with top employers and discover opportunities that match your skills</p>
          <div className="hero-buttons">
            <Link to="/jobs" className="btn-hero-primary">Browse Jobs</Link>
            <Link to="/register" className="btn-hero-secondary">Get Started</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Our Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Thousands of Jobs</h3>
            <p>Access a wide range of job opportunities from leading companies</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Easy Application</h3>
            <p>Apply to multiple jobs with just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your application status in real-time</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Top Companies</h3>
            <p>Connect with industry-leading employers</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of job seekers and employers on our platform</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-cta">Sign Up Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
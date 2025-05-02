import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About VisualAI</h1>
          <p className="about-subtitle">
            We're on a mission to make goal achievement more accessible through advanced AI planning technologies.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-container">
          <h2>Our Story</h2>
          <p>
            VisualAI was founded in 2023 by a team of AI researchers and productivity experts who recognized a common 
            problem: people often have ambitious goals but struggle to create actionable plans to achieve them.
          </p>
          <p>
            We set out to develop an AI solution that could bridge the gap between aspiration and achievement by 
            transforming vague ideas into concrete, step-by-step plans. Our platform combines state-of-the-art natural 
            language processing with deep expertise in goal-setting methodologies.
          </p>
          <p>
            Today, VisualAI helps thousands of users across the globe turn their dreams into reality through 
            personalized planning and progress tracking.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Clarity Through Complexity</h3>
              <p>We believe in making the complex simple and the ambiguous clear, creating pathways through uncertainty.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Empowerment Through Technology</h3>
              <p>We develop tools that augment human capability, not replace it, putting powerful AI in service of human potential.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔍</div>
              <h3>Continuous Improvement</h3>
              <p>We're committed to constant learning and iteration, both in our products and as a team.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Responsible AI</h3>
              <p>We develop AI systems with privacy, security, and ethical considerations at the forefront of our process.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="about-container">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Sophia Chen</h3>
              <p className="member-title">CEO & Co-Founder</p>
              <p className="member-bio">Ph.D. in Machine Learning, previously led AI research teams at TechCorp</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Marcus Williams</h3>
              <p className="member-title">CTO & Co-Founder</p>
              <p className="member-bio">Former Principal Engineer at FutureTech, specializing in NLP systems</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Aisha Patel</h3>
              <p className="member-title">Head of Product</p>
              <p className="member-bio">Expert in UX design with a background in cognitive psychology</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>David Kim</h3>
              <p className="member-title">Lead AI Engineer</p>
              <p className="member-bio">Specializes in developing robust, scalable machine learning systems</p>
            </div>
          </div>
        </div>
      </section>

      <section className="join-team-section">
        <div className="about-container">
          <div className="join-content">
            <h2>Join Our Team</h2>
            <p>
              We're always looking for passionate individuals who share our vision of making AI accessible and helpful.
              Check out our open positions or reach out if you think you'd be a great fit.
            </p>
            <a href="#" className="primary-button">See Open Positions</a>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="about-container">
          <h2>Start Your Journey With VisualAI Today</h2>
          <p>Experience the power of AI-driven planning to achieve your goals.</p>
          <Link to="/create" className="primary-button">Try VisualAI Free</Link>
        </div>
      </section>
    </div>
  );
}
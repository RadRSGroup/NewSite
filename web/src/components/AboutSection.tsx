import React from 'react';
/**
 * @component AboutSection
 * @description About section with company philosophy and mission
 */
export default function AboutSection() {
  return (
    <section id="about" className="about">
      {/* TODO: Add about-content, about-text, and mission-container */}
      <div className="about-content">
        <div className="about-text">
          <h2 className="doers-text">We are Doers.</h2>
          <p className="lead">We believe in the power of Dreams.</p>
          {/* ...more text... */}
        </div>
        <div className="mission-container">
          <div className="mission-content">
            <h3>Our Mission</h3>
            {/* ...mission statement... */}
          </div>
        </div>
      </div>
    </section>
  );
} 
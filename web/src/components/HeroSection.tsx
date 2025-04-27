import CanvasContainer from './CanvasContainer';
import React from 'react';

/**
 * @component HeroSection
 * @description Hero section with main heading, tagline, and particle canvas
 */
export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>RS Group</h1>
        <p>Transforming Institutional Knowledge into Innovative Solutions</p>
      </div>
      <CanvasContainer />
    </section>
  );
} 
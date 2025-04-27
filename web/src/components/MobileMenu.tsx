import React, { useState, useEffect } from 'react';
/**
 * @component MobileMenu
 * @description Handles the mobile navigation menu, including toggle, accessibility, and scroll effects.
 */
export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Toggle body overflow to prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Close menu when clicking on a navigation link
  useEffect(() => {
    const handleNavLinkClick = () => {
      closeMenu();
    };
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });
    return () => {
      navLinks.forEach(link => {
        link.removeEventListener('click', handleNavLinkClick);
      });
    };
  }, []);

  // Handle header scroll effect
  useEffect(() => {
    const header = document.querySelector('.header');
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <button 
        className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`} 
        aria-label="Toggle menu" 
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <span className="menu-icon"></span>
      </button>
      <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <li><a href="#home" className="nav-link">Home</a></li>
        <li><a href="#about" className="nav-link">About</a></li>
        <li><a href="#services" className="nav-link">Services</a></li>
        <li><a href="#contact" className="nav-link">Contact</a></li>
      </ul>
    </>
  );
} 
# RenderTS NewSite

A modern, responsive website featuring an enhanced Three.js particle system with dynamic animations and glassmorphism design. Built with vanilla JavaScript and advanced CSS3 techniques.

## 🌟 Features

### 🌌 Enhanced Particle System
- **4000 dynamic particles** with individual rotation and physics simulation
- **Sharp, high-resolution textures** (64px) for crisp visual quality
- **Dynamic blue-to-cyan color spectrum** with warm contrasting glow effects
- **Sparkle effects** with fade-in/fade-out animations and random activation
- **Gentle swirl rotation** with continuous X/Y axis movement
- **Cross-platform optimization** including Windows-specific rendering improvements
- **Particle visibility** throughout all page sections with semi-transparent overlays

### 🎨 Visual Design
- **Glassmorphism interface** with backdrop blur effects and semi-transparent sections
- **Enhanced card designs** with 3D hover transformations and depth shadows
- **Responsive grid layouts** that adapt seamlessly to all screen sizes
- **Smooth animations** with cubic-bezier easing and micro-interactions
- **Gradient backgrounds** with contrasting warm/cool color schemes
- **Advanced lighting effects** with particle glow and sparkle systems

### 📱 Responsive & Accessible
- **Mobile-first design** with touch-optimized interactions
- **Accessibility features** including skip links, reduced motion support, and ARIA labels
- **Cross-browser compatibility** with vendor prefix support and fallbacks
- **Performance optimized** with throttled animations, efficient rendering, and adaptive quality

## 🚀 Getting Started

### Prerequisites
- Web server (e.g., Live Server, Apache, Nginx)
- Modern web browser
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RadRSGroup/NewSite.git
```

2. Navigate to the project directory:
```bash
cd NewSite
```

3. Start a local web server. If using VS Code with Live Server:
   - Right-click `index.html`
   - Select "Open with Live Server"

Alternatively, use Python's built-in server:
```bash
python -m http.server 8000
```

4. Open your browser and visit:
```
http://localhost:8000
```

## 🎨 Customization

### Colors
The color scheme can be modified in `css/styles.css`:
```css
:root {
    --primary-color: #0a0f4c;    /* Deep blue */
    --secondary-color: #e31837;   /* Red */
    --accent-color: #ffffff;      /* White */
    --text-color: #f0f2ff;       /* Light text */
    --dark-bg: #050826;          /* Dark background */
    --light-bg: #0d1445;         /* Light background */
}
```

### Particle System Configuration
The particle system can be customized in `js/particles.js`:

```javascript
// Core particle settings
particleCount: 4000,                    // Total number of particles
particleSize: 0.12,                     // Base particle size
radius: 9.5 + Math.random() * 3,       // Spawn radius (9.5-12.5)

// Animation settings
rotationSpeed: 0.002,                   // Global rotation speed
waveIntensity: 0.002,                   // Wave movement intensity
timeScale: 0.2,                         // Overall animation speed

// Visual effects
sparkleIntensity: 0.8,                  // Sparkle brightness
glowEffects: true,                      // Enable glow effects
opacity: 0.85,                          // Particle opacity
```

### Advanced Features
- **Individual particle rotation** with unique speeds and directions
- **Physics simulation** with gravity, damping, and repulsion forces
- **Dynamic color transitions** based on rotation and time
- **Sparkle system** with random activation and fade cycles
- **Performance scaling** based on device capabilities

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- Desktop: 1024px and above
- Tablet: 768px to 1023px
- Mobile: Below 768px
- Small devices: Below 480px

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js for 3D particle effects
- Modern CSS features for animations
- Performance optimization techniques

## 📞 Support

For support, email support@radrgroup.com or open an issue in the repository. 
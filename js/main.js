// Custom cursor
const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Add active class to cursor when hovering over interactive elements
const interactiveElements = document.querySelectorAll('a, button, .service-card');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// GSAP animations
gsap.registerPlugin(ScrollTrigger);

// Animate hero content
gsap.from('.hero-content', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

// Animate service cards
gsap.utils.toArray('.service-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
});

// Animate contact form
gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact',
        start: 'top center',
        toggleActions: 'play none none reverse'
    },
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

// Initialize particles.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const config = {
        "particles": {
            "number": {
                "value": 180,
                "density": {
                    "enable": true,
                    "value_area": isMobile ? 1000 : 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.7,
                "random": false,
                "anim": {
                    "enable": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 80,
                "color": "#ff0000",
                "opacity": 0.6,
                "width": 1.5
            },
            "move": {
                "enable": true,
                "speed": 1.5,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "bounce",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "window",
            "events": {
                "onhover": {
                    "enable": false
                },
                "onclick": {
                    "enable": false
                },
                "resize": true,
                "touchstart": {
                    "enable": false
                },
                "touchmove": {
                    "enable": false
                },
                "touchend": {
                    "enable": false
                }
            }
        },
        "retina_detect": true,
        "fps_limit": 30
    };

    // Initialize particles
    particlesJS("particles-js", config);

    // Handle window resize
    function updateParticleDensity() {
        if (window.pJSDom && window.pJSDom[0]) {
            window.pJSDom[0].pJS.particles.number.density.value_area = isMobile ? 1000 : 800;
            window.pJSDom[0].pJS.fn.particlesRefresh();
        }
    }

    window.addEventListener('resize', updateParticleDensity);

    // Only add mouse movement effect on non-touch devices
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Calculate target rotations based on cursor position relative to center
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            targetRotationY = ((mouseX - centerX) / centerX) * 35; // max 35 degrees
            targetRotationX = ((mouseY - centerY) / centerY) * -35; // max 35 degrees
        });
    }

    // Smooth animation loop for rotation
    function animate() {
        if (!isMobile) {
            // Smoothly interpolate current rotation to target rotation
            currentRotationX += (targetRotationX - currentRotationX) * 0.05;
            currentRotationY += (targetRotationY - currentRotationY) * 0.05;
            
            const canvas = document.querySelector('#particles-js canvas');
            if (canvas) {
                canvas.style.transform = `perspective(3000px) rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
            }
        }
        requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();
});

// Enhanced cursor following effect with smooth repulsion
let mouseX = 0;
let mouseY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let isMoving = false; 
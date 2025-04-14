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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        // Initial state
        gsap.set(heroContent, { opacity: 0, y: 50 });

        // Animate hero content
        gsap.to(heroContent, {
            duration: 1.5,
            y: 0,
            opacity: 1,
            ease: 'power3.out',
            delay: 0.5
        });

        // Animate hero heading
        gsap.from('.hero-content h1', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.8
        });

        // Animate hero paragraph
        gsap.from('.hero-content p', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 1
        });

        // Add floating animation to hero content
        gsap.to(heroContent, {
            y: 10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 2
        });
    }

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add active class to cursor when hovering over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .service-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => cursor.classList.add('active'));
            element.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

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

    // Initialize particle line system
    const cards = document.querySelectorAll('.project-card');
    let activeCard = null;
    let mouseX = 0;
    let mouseY = 0;

    // Create particle line elements
    cards.forEach(card => {
        const line = document.createElement('div');
        line.className = 'particle-line';
        card.appendChild(line);

        const node = document.createElement('div');
        node.className = 'particle-node';
        card.appendChild(node);
    });

    // Update particle line position and connection
    function updateParticleLine() {
        if (!activeCard) return;

        const line = activeCard.querySelector('.particle-line');
        const node = activeCard.querySelector('.particle-node');
        const rect = activeCard.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const cardCenterY = rect.top + rect.height / 2;

        // Calculate angle and distance
        const dx = mouseX - cardCenterX;
        const dy = mouseY - cardCenterY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Update line position and rotation
        line.style.width = `${distance}px`;
        line.style.left = `${rect.width / 2}px`;
        line.style.top = `${rect.height / 2}px`;
        line.style.transform = `rotate(${angle}rad)`;

        // Update node position
        node.style.left = `${mouseX - rect.left}px`;
        node.style.top = `${mouseY - rect.top}px`;
    }

    // Single mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateParticleLine();
    });

    // Card hover handlers
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            activeCard = card;
            const line = card.querySelector('.particle-line');
            const node = card.querySelector('.particle-node');
            line.style.opacity = '1';
            node.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            activeCard = null;
            const line = card.querySelector('.particle-line');
            const node = card.querySelector('.particle-node');
            line.style.opacity = '0';
            node.style.opacity = '0';
        });
    });

    // Animate elements on scroll
    gsap.utils.toArray('.project-card, .principle-card, .methodology-step').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top bottom-=100',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
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

// Enhanced section animations that mirror hero style
const sections = gsap.utils.toArray('section:not(.hero)');
sections.forEach(section => {
    // Create parallax effect for section backgrounds
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
            toggleActions: 'play none none reverse'
        },
        backgroundPosition: `50% ${-50}%`,
        ease: 'none'
    });

    // Animate section content with stagger
    const content = section.querySelector('div[class$="-content"]') || section.querySelector('div[class$="-grid"]');
    if (content) {
        gsap.from(content.children, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1,
                toggleActions: 'play none none reverse'
            },
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    // Add hover animation for interactive elements
    const cards = section.querySelectorAll('.principle-card, .project-card, .methodology-step');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xPercent = (x / rect.width - 0.5) * 20;
            const yPercent = (y / rect.height - 0.5) * 20;
            
            gsap.to(card, {
                duration: 0.5,
                rotationY: xPercent,
                rotationX: -yPercent,
                scale: 1.05,
                ease: 'power1.out',
                transformPerspective: 1000,
                transformOrigin: 'center'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotationY: 0,
                rotationX: 0,
                scale: 1,
                ease: 'power3.out'
            });
        });
    });
});

// Add particle effect to section backgrounds
sections.forEach(section => {
    if (!section.classList.contains('hero')) {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'section-particles';
        section.insertBefore(particlesContainer, section.firstChild);
        
        const particlesCount = 20;
        for (let i = 0; i < particlesCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.setProperty('--delay', `${Math.random() * 5}s`);
            particle.style.setProperty('--size', `${Math.random() * 10 + 5}px`);
            particle.style.setProperty('--left', `${Math.random() * 100}%`);
            particle.style.setProperty('--opacity', `${Math.random() * 0.3}`);
            particlesContainer.appendChild(particle);
        }
    }
});

// Add particle effects to tags and keywords
function createTagParticles(tag) {
    const particleCount = 8;
    const container = document.createElement('div');
    container.className = 'tag-particles';
    tag.appendChild(container);

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'tag-particle';
        
        // Random direction and distance for particles
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = Math.random() * 30 + 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--delay', `${Math.random() * 0.2}s`);
        
        container.appendChild(particle);
    }
}

// Initialize tag particles
document.querySelectorAll('.tag').forEach(tag => {
    createTagParticles(tag);
    
    tag.addEventListener('mouseenter', () => {
        const particles = tag.querySelectorAll('.tag-particle');
        particles.forEach(particle => {
            particle.style.animation = 'none';
            void particle.offsetWidth; // Trigger reflow
            particle.style.animation = 'tagParticleFloat 1s ease-out forwards';
        });
    });
});

// Add particle burst effect to stats
document.querySelectorAll('.stat-count').forEach(stat => {
    stat.addEventListener('mouseenter', () => {
        const burst = document.createElement('div');
        burst.className = 'stat-burst';
        stat.appendChild(burst);
        
        setTimeout(() => {
            burst.remove();
        }, 300);
    });
}); 
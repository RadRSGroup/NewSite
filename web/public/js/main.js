// DOM Elements
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');
const form = document.querySelector('.contact-form');
const loadingOverlay = document.createElement('div');
const scrollProgress = document.createElement('div');

// Windows-specific optimizations
function initWindowsOptimizations() {
    const isWindows = navigator.userAgent.includes('Windows');
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    
    if (isWindows) {
        console.log('Applying Windows optimizations...');
        
        // Reduce animation complexity on Windows
        document.documentElement.style.setProperty('--animation-duration', '0.6s');
        document.documentElement.style.setProperty('--transition-speed', '0.2s');
        
        // Disable some heavy animations on low-end Windows devices
        if (isLowEndDevice) {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
            document.documentElement.style.setProperty('--transition-speed', '0.1s');
        }
        
        // Force hardware acceleration for all animated elements
        const animatedElements = document.querySelectorAll('.project-card, .ai-section, .methodology-card, .result-card, .mission-container');
        animatedElements.forEach(el => {
            el.style.transform = 'translateZ(0)';
            el.style.willChange = 'transform';
            el.style.backfaceVisibility = 'hidden';
        });
        
        // Optimize particle container specifically for Windows
        const canvasContainer = document.getElementById('canvas-container');
        if (canvasContainer) {
            canvasContainer.style.transform = 'translateZ(0)';
            canvasContainer.style.willChange = 'transform';
            canvasContainer.style.backfaceVisibility = 'hidden';
        }
        
        // Optimize all canvas elements
        setTimeout(() => {
            document.querySelectorAll('canvas').forEach(canvas => {
                canvas.style.transform = 'translateZ(0)';
                canvas.style.willChange = 'transform';
                canvas.style.imageRendering = 'auto';
                canvas.style.imageRendering = '-webkit-optimize-contrast';
            });
        }, 1000);
        
        console.log('Windows optimizations applied successfully');
    }
}

// Loading Animation
function initLoading() {
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);
    
    // Show loading animation
    loadingOverlay.classList.add('active');
    
    // Hide loading animation after content is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.classList.remove('active');
            setTimeout(() => loadingOverlay.remove(), 500);
        }, 1000);
    });
}

// Scroll Progress Indicator
function initScrollProgress() {
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.documentElement.style.setProperty('--scroll', `${scrolled}%`);
    });
}

// Enhanced Scroll Animations with Windows optimization
function handleScroll() {
    // Header scroll effect
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Section animations with intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger animations slightly earlier
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Enhanced Mobile Menu
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Enhanced Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Simulate API call
    setTimeout(() => {
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message with animation
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.cssText = `
            background: linear-gradient(135deg, rgba(227, 24, 55, 0.1), rgba(10, 15, 76, 0.1));
            color: #f0f2ff;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
            animation: fadeIn 0.5s ease forwards;
        `;
        successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
        form.appendChild(successMessage);
        
        // Reset form
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 500);
        }, 5000);
    }, 1500);
}

// Smooth Scrolling with enhanced behavior
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = header ? header.offsetHeight : 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// Add hover lift effect to cards with Windows optimization
function enhanceCards() {
    const cards = document.querySelectorAll('.project-card, .methodology-card, .result-card, .mission-container');
    cards.forEach(card => {
        card.classList.add('hover-lift');
        
        // Add Windows-specific optimizations
        if (navigator.userAgent.includes('Windows')) {
            card.style.transform = 'translateZ(0)';
            card.style.willChange = 'transform';
        }
    });
}

// Add micro-interactions to buttons
function enhanceButtons() {
    document.querySelectorAll('button, .btn, .cta-button').forEach(button => {
        button.classList.add('btn-micro');
    });
}

// AI Section Scroll Animation Observer with Windows optimization
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('ai-title')) {
                entry.target.classList.add('visible');
                // Animate sections sequentially after title
                const sections = document.querySelectorAll('.ai-section');
                const delay = navigator.userAgent.includes('Windows') ? 300 : 500; // Faster on Windows
                
                sections.forEach((section, index) => {
                    setTimeout(() => {
                        section.classList.add('visible');
                    }, index * delay);
                });
            } else if (entry.target.classList.contains('ai-section')) {
                // Only animate if the title is already visible
                const title = document.querySelector('.ai-title');
                if (title && title.classList.contains('visible')) {
                    entry.target.classList.add('visible');
                }
            }
        } else {
            // Reset animations when scrolling back up (disabled on Windows for performance)
            if (!navigator.userAgent.includes('Windows')) {
                if (entry.target.classList.contains('ai-title')) {
                    entry.target.classList.remove('visible');
                    document.querySelectorAll('.ai-section').forEach(section => {
                        section.classList.remove('visible');
                    });
                }
            }
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

// Enhanced scroll handler with Windows optimization
let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const aiSections = document.querySelectorAll('.ai-section');
            const threshold = navigator.userAgent.includes('Windows') ? 0.9 : 0.8; // Earlier trigger on Windows
            
            aiSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * threshold;
                if (isVisible) {
                    section.classList.add('visible');
                }
            });
            ticking = false;
        });
        ticking = true;
    }
}

// Performance monitoring for Windows
function initPerformanceMonitoring() {
    if (navigator.userAgent.includes('Windows')) {
        let frameCount = 0;
        let lastTime = performance.now();
        
        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                
                // If FPS is too low, apply additional optimizations
                if (fps < 30) {
                    console.log(`Low FPS detected (${fps}). Applying additional Windows optimizations...`);
                    
                    // Reduce animation frequency
                    document.documentElement.style.setProperty('--animation-duration', '0.2s');
                    
                    // Disable some heavy effects
                    document.querySelectorAll('.glass-card').forEach(card => {
                        card.style.backdropFilter = 'none';
                    });
                }
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        // Start monitoring after a delay
        setTimeout(() => {
            requestAnimationFrame(measureFPS);
        }, 3000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing main.js...');
    
    // Apply Windows optimizations first
    initWindowsOptimizations();
    
    // Initialize core functionality
    initLoading();
    initScrollProgress();
    handleScroll();
    initSmoothScrolling();
    enhanceCards();
    enhanceButtons();
    
    // Initialize AI section animations
    const aiTitle = document.querySelector('.ai-title');
    const aiSections = document.querySelectorAll('.ai-section');
    
    if (aiTitle) scrollObserver.observe(aiTitle);
    aiSections.forEach(section => scrollObserver.observe(section));
    
    // Add scroll event listener
    window.addEventListener('scroll', onScroll);
    
    // Add page transition class to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('page-transition', 'active');
    }
    
    // Event Listeners
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Start performance monitoring on Windows
    initPerformanceMonitoring();
    
    console.log('Main.js initialization complete');
});

// Handle visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive operations when tab is hidden
        console.log('Tab hidden - pausing animations');
    } else {
        // Resume operations when tab is visible
        console.log('Tab visible - resuming animations');
    }
});

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reapply optimizations after resize
        if (navigator.userAgent.includes('Windows')) {
            initWindowsOptimizations();
        }
    }, 250);
});
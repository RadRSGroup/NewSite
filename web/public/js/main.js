// DOM Elements
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');
const sections = document.querySelectorAll('section');
const form = document.querySelector('.contact-form');
const loadingOverlay = document.createElement('div');
const scrollProgress = document.createElement('div');

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

// Enhanced Scroll Animations
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
        threshold: 0.1
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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = header.offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
});

// Add hover lift effect to cards
document.querySelectorAll('.service-card, .team-member').forEach(card => {
    card.classList.add('hover-lift');
});

// Add micro-interactions to buttons
document.querySelectorAll('button, .btn').forEach(button => {
    button.classList.add('btn-micro');
});

// Scroll Animation Observer
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('ai-title')) {
                entry.target.classList.add('visible');
                // Animate sections sequentially after title
                const sections = document.querySelectorAll('.ai-section');
                sections.forEach((section, index) => {
                    setTimeout(() => {
                        section.classList.add('visible');
                    }, index * 500); // Increased delay for more dramatic effect
                });
            } else if (entry.target.classList.contains('ai-section')) {
                // Only animate if the title is already visible
                const title = document.querySelector('.ai-title');
                if (title && title.classList.contains('visible')) {
                    entry.target.classList.add('visible');
                }
            }
        } else {
            // Reset animations when scrolling back up
            if (entry.target.classList.contains('ai-title')) {
                entry.target.classList.remove('visible');
                document.querySelectorAll('.ai-section').forEach(section => {
                    section.classList.remove('visible');
                });
            }
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
});

// Enhanced scroll handler
let lastScrollY = window.scrollY;
let ticking = false;

function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const aiSections = document.querySelectorAll('.ai-section');
            aiSections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8;
                if (isVisible) {
                    section.classList.add('visible');
                }
            });
            ticking = false;
        });
        ticking = true;
    }
}

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    const aiTitle = document.querySelector('.ai-title');
    const aiSections = document.querySelectorAll('.ai-section');
    
    if (aiTitle) scrollObserver.observe(aiTitle);
    aiSections.forEach(section => scrollObserver.observe(section));
    
    // Add scroll event listener
    window.addEventListener('scroll', onScroll);
    
    // Initialize other functionality
    initLoading();
    initScrollProgress();
    handleScroll();
    
    // Add page transition class to main content
    document.querySelector('main').classList.add('page-transition', 'active');
    
    // Event Listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    form.addEventListener('submit', handleFormSubmit);
}); 
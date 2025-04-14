// Contact Form Animations and Particles
document.addEventListener('DOMContentLoaded', () => {
    const contactSection = document.querySelector('.contact');
    const form = document.querySelector('.contact-form');
    
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'contact-particles';
    contactSection.appendChild(particlesContainer);
    
    // Create particles
    function createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'contact-particle';
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random animation delay
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Form input animations
    function handleInputFocus(e) {
        const input = e.target;
        input.style.transform = 'translateY(-2px)';
        input.style.boxShadow = '0 0 15px rgba(227, 24, 55, 0.2)';
    }
    
    function handleInputBlur(e) {
        const input = e.target;
        input.style.transform = 'translateY(0)';
        input.style.boxShadow = 'none';
    }
    
    // Add event listeners
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
    });
    
    // Form submission animation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add loading state
        const button = form.querySelector('button');
        button.style.opacity = '0.7';
        button.disabled = true;
        
        // Simulate form submission (replace with actual form submission)
        setTimeout(() => {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <h3>Message Sent!</h3>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
            `;
            form.parentNode.insertBefore(successMessage, form.nextSibling);
            
            // Reset form
            form.reset();
            button.style.opacity = '1';
            button.disabled = false;
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
                setTimeout(() => successMessage.remove(), 500);
            }, 5000);
        }, 1500);
    });
    
    // Initialize particles
    createParticles();
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Observe form elements
    const formElements = form.querySelectorAll('input, textarea, button');
    formElements.forEach(element => observer.observe(element));
}); 
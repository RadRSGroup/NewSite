// Initialize EmailJS with your public key
emailjs.init("jYDleJ3XAbMlie312");

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
            
            try {
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Send the email using EmailJS
                await emailjs.send("service_880k0wi", "template_bnj38mb", {
                    from_name: data.name,
                    from_email: data.email,
                    message: data.message
                });
                
                // Show success message
                contactForm.innerHTML = `
                    <div class="success-message">
                        <h3>Thank you for your message!</h3>
                        <p>We'll get back to you soon.</p>
                    </div>
                `;
                
            } catch (error) {
                console.error('Error sending email:', error);
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Sorry, there was an error sending your message. Please try again later.';
                contactForm.appendChild(errorMessage);
                
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
}); 
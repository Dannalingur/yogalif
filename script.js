// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Smooth Scrolling
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Check if it's an external link (to another page)
        if (href.includes('.html')) {
            // Don't prevent default, let the browser navigate
            return;
        }
        
        // For internal anchor links
        e.preventDefault();
        const targetSection = document.querySelector(href);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
        }
    });
});

// Active Navigation Highlight
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form Submission with AJAX to prevent redirect
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form data
        const formData = new FormData(this);
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sendir...';
        submitBtn.disabled = true;
        
        // Submit form via AJAX
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                showSuccessMessage();
                // Reset form
                this.reset();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Show error message
            showErrorMessage();
        })
        .finally(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

function showSuccessMessage() {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message form-success';
    successDiv.innerHTML = '<p><strong>Takk fyrir fyrirspurnina.</strong> Við munum hafa samband við þig.</p>';
    successDiv.style.cssText = `
        background: linear-gradient(135deg, var(--primary-sage), var(--primary-warm));
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 12px rgba(156, 175, 136, 0.3);
        animation: slideIn 0.5s ease-out;
    `;
    
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.parentNode.insertBefore(successDiv, form);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.style.transition = 'opacity 0.5s ease-out';
                successDiv.style.opacity = '0';
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.remove();
                    }
                }, 500);
            }
        }, 5000);
    }
}

function showErrorMessage() {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message form-error';
    errorDiv.innerHTML = '<p><strong>Villa kom upp.</strong> Vinsamlegast reyndu aftur eða hafðu samband í síma.</p>';
    errorDiv.style.cssText = `
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        text-align: center;
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        animation: slideIn 0.5s ease-out;
    `;
    
    const form = document.querySelector('.contact-form form');
    if (form) {
        form.parentNode.insertBefore(errorDiv, form);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.transition = 'opacity 0.5s ease-out';
                errorDiv.style.opacity = '0';
                setTimeout(() => {
                    if (errorDiv.parentNode) {
                        errorDiv.remove();
                    }
                }, 500);
            }
        }, 5000);
    }
}

// Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.class-card, .instructor-card, .schedule-day');
animateElements.forEach(el => observer.observe(el));

// Add active class styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
});


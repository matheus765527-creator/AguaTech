// ========================================
// AGUATECH - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initAnimations();
    initContactForm();
    initCounterAnimation();
});

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Header scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ========================================
// SCROLL EFFECTS
// ========================================
function initScrollEffects() {
    // Parallax effect for hero
    const heroBg = document.querySelector('.hero-bg');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        if (heroBg && scrollPosition < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        }
    });
}

// ========================================
// ANIMATIONS (Intersection Observer)
// ========================================
function initAnimations() {
    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll(
        '.process-card, .solution-card, .benefit-item, .sector-card, .stat-item, .section-header'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    // Create observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Start counter animation if it's a stat item
                if (entry.target.classList.contains('stat-item')) {
                    const counter = entry.target.querySelector('.stat-number');
                    if (counter && !counter.dataset.animated) {
                        animateCounter(counter);
                        counter.dataset.animated = 'true';
                    }
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Also observe stat items separately
    document.querySelectorAll('.stat-item').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounterAnimation() {
    // Counter animation is triggered by intersection observer in initAnimations
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count) || 0;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                let successMsg = form.querySelector('.form-success');
                
                if (!successMsg) {
                    successMsg = document.createElement('div');
                    successMsg.className = 'form-success';
                    successMsg.innerHTML = '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    form.appendChild(successMsg);
                }
                
                successMsg.classList.add('show');
                
                // Reset form
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);
                
                console.log('Form submitted:', data);
            }, 1500);
        });

        // Input animations
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

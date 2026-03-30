// DOM Elements
const hamburger = document.querySelector('.hamburger');
const filterBtns = document.querySelectorAll('.filter-btn');
const artifactItems = document.querySelectorAll('.artifact-item');
const contactForm = document.getElementById('contactForm');
const scrollTop = document.getElementById('scrollTop');
const scrollProgress = document.getElementById('scrollProgress');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Enhanced scroll handler for both directions with better reverse scroll
const scrollHandler = throttle(() => {
    const scrolledY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrolledY / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
    
    // Show/Hide Scroll to Top Button
    if (scrolledY > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
    
    // Navbar scroll effect
    if (scrolledY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Enhanced bidirectional section reveal animations
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.clientHeight;
        const viewportTop = scrolledY;
        const viewportBottom = scrolledY + window.innerHeight;
        
        // Enhanced visibility detection for both scroll directions
        const isInViewport = (viewportBottom >= sectionTop * 0.7 && viewportTop <= sectionBottom * 1.1);
        const isFullyVisible = (viewportTop >= sectionTop - 100 && viewportBottom <= sectionBottom + 100);
        
        // Keep sections visible once they've been revealed (better reverse scroll)
        if (isInViewport || isFullyVisible) {
            section.classList.add('visible');
            
            // Animate section title separately with delay
            const sectionTitle = section.querySelector('.section-title');
            if (sectionTitle && !sectionTitle.classList.contains('visible')) {
                setTimeout(() => {
                    sectionTitle.classList.add('visible');
                }, 100); // Reduced delay for better responsiveness
            }
            
            // Animate cards with enhanced staggered delay
            const cards = section.querySelectorAll('.reflection-card, .artifact-item');
            cards.forEach((card, index) => {
                if (!card.classList.contains('visible')) {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 200 + (index * 80)); // Optimized timing
                }
            });
        }
        
        // Never hide sections once visible (fixes reverse scroll issue)
        // This ensures elements stay visible when scrolling back up
    });
}, 8); // Higher frequency for smoother scrolling

window.addEventListener('scroll', scrollHandler);

// Add wheel event for even smoother scrolling
let isScrolling = false;
window.addEventListener('wheel', (e) => {
    if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
            isScrolling = false;
        });
    }
}, { passive: true });

// Optimized Scroll to Top
scrollTop.addEventListener('click', () => {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 600; // ms
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smooth acceleration/deceleration
        const ease = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + (distance * ease));
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
});

// Mobile Navigation Toggle (for hamburger if needed)
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
});

// Artifact Filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Reset all items first
        artifactItems.forEach(item => {
            item.style.display = 'none';
            item.style.animation = 'none';
        });
        
        // Show/hide items based on filter
        setTimeout(() => {
            artifactItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    const itemCategory = item.getAttribute('data-category');
                    if (itemCategory === filterValue) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.5s ease';
                    }
                }
            });
        }, 100);
    });
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification function
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 500);
    }
    
    // Premium entrance animations
    setTimeout(() => {
        document.querySelector('#home').classList.add('visible');
        document.querySelector('.hero-content').classList.add('visible');
    }, 100);
    
    setTimeout(() => {
        document.querySelector('.hero-title').classList.add('visible');
    }, 600);
    
    setTimeout(() => {
        document.querySelector('.hero-subtitle').classList.add('visible');
    }, 900);
    
    setTimeout(() => {
        document.querySelector('.hero-buttons').classList.add('visible');
    }, 1200);
});

// Optimized Parallax effect for hero section
const parallaxHandler = throttle(() => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`; // Reduced intensity
    }
}, 16);

window.addEventListener('scroll', parallaxHandler);

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Console welcome message
console.log('%c Welcome to my Portfolio! ', 'background: #2563eb; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');

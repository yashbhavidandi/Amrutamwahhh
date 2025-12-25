// Initialize particles on page load
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initializeAnimations();
    setupScrollAnimations();
});

// Create floating particles (UPDATED: Snowflakes and Christmas items)
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    // Changed emojis to Christmas theme
    const particleEmojis = ['❄️', '❅', '❆', '✨', '🎄', '🎁', '⛄'];

    // Increased count slightly for denser snow
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML =
            particleEmojis[Math.floor(Math.random() * particleEmojis.length)];

        // Random position across width
        particle.style.left = Math.random() * 100 + '%';
        // Start slightly above screen to avoid pop-in
        particle.style.top = -10 + '%';

        // Random animation duration and delay for natural fall speed variations
        // Snow falls slower than the previous hearts float up
        const duration = Math.random() * 5 + 10; // Between 10s and 15s fall time
        particle.style.animationDuration = duration + 's';
        // Negative delay to have particles already on screen at load
        particle.style.animationDelay = -(Math.random() * duration) + 's';
        
        // Random size variation
        const sizeStr = (Math.random() * 1 + 0.8) + 'rem';
        particle.style.fontSize = sizeStr;

        particlesContainer.appendChild(particle);
    }
}

// Initialize typewriter and other standard fade animations
function initializeAnimations() {
    // Typewriter effect is handled by CSS

    // Add staggered animation delays to elements marked with .fade-in (like subtitle)
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        // Base delay + index delay so they don't start immediately
        element.style.animationDelay = (2.5 + index * 0.3) + 's';
    });
}

// Scroll animations (AOS - Animate On Scroll)
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.2, // Trigger when 20% visible
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                // Special handling for message text staggering
                if (entry.target.classList.contains('message-card')) {
                    animateMessageText(entry.target);
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe the message card
    const messageCard = document.querySelector('.message-card');
    if (messageCard) {
        observer.observe(messageCard);
    }
}

// Animate message text with staggered effect inside the card
function animateMessageText(cardElement) {
    const messageTexts = cardElement.querySelectorAll('.message-text, .message-signature');
    messageTexts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('fade-in-animate');
        }, index * 600); // 600ms delay between paragraphs
    });
}

// Smooth scroll to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ----- Removed Gallery Functions (toggleLike, createFloatingHeart, photoObserver) -----

// Add parallax effect to hero section and Santa section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero Parallax
    const hero = document.querySelector('.hero');
    if (hero) {
        // Move hero content slowly
        hero.querySelector('.hero-content').style.transform = `translateY(${scrolled * 0.3}px)`;
        // Move snowman slightly faster for depth
        hero.querySelector('.snowman-container').style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // Santa Section Parallax (if visible)
    const santaSection = document.getElementById('santa-arrival');
    if (santaSection) {
        const rect = santaSection.getBoundingClientRect();
        // Only animate if in view
        if(rect.top < window.innerHeight && rect.bottom > 0) {
             // Calculate scroll relative to the section start
             const relativeScroll = window.innerHeight - rect.top;
             // Move terrace slowly up to create depth against the flying Santa
             const terrace = santaSection.querySelector('.terrace-container');
             if(terrace) {
                  terrace.style.transform = `translateY(${-relativeScroll * 0.1}px)`;
             }
        }
    }
});

// Add mouse movement effect (Parallax) to hero elements
document.addEventListener('mousemove', (e) => {
    // Only run if near top of page to save performance
    if (window.pageYOffset > window.innerHeight) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    // Subtle movement effect calculation
    const moveX = (x - 0.5) * 30;
    const moveY = (y - 0.5) * 30;

    // Move floating elements (emojis)
    const floatingElements = document.querySelector('.floating-elements');
    if (floatingElements) {
        floatingElements.style.transform = `translate(${moveX * -1}px, ${moveY * -1}px)`;
    }
    
    // Move snowman slightly opposite direction for depth
    const snowman = document.querySelector('.snowman-container');
    if (snowman && window.innerWidth > 768) { // Only on desktop
         snowman.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
    }
});

// Add CSS-based ripple effect on click for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        // Calculate biggest dimension for ripple size
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        // Add the ripple style
        ripple.className = 'ripple-effect';
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);

        // Remove after animation completes
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Inject ripple animation styles
const style = document.createElement('style');
style.textContent = `
  .cta-button { position: relative; overflow: hidden; }
  .ripple-effect {
      position: absolute;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: scale(0);
      animation: rippleAnimate 0.6s linear;
      pointer-events: none;
  }
  @keyframes rippleAnimate {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);
// ----- Gift Box Functions -----

function openGift() {
    const overlay = document.getElementById('secret-message-overlay');
    // Show the overlay
    overlay.classList.remove('hidden');
    // Slight delay to allow display:block to apply before opacity transition
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    // Optional: Add confetti if you want!
    createParticles(); // Re-uses your existing particle function for effect
}

function closeGift() {
    const overlay = document.getElementById('secret-message-overlay');
    overlay.classList.remove('show');
    
    // Wait for fade out animation to finish before hiding
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 500);
}
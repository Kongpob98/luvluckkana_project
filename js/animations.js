// Animations Module
// Handles all animations: circle pulse, star rotation, and parallax effects

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeroParallax();
        this.setupParallax();
        this.setupScrollEffects();
    }

    // ─── Smooth Hero Parallax (Section 1) ─────────────────────────────────────
    setupHeroParallax() {
        this.heroVideoWrapper = document.querySelector('.hero-video-wrapper');

        window.addEventListener('scroll', () => {
            if (this.heroVideoWrapper) {
                this.heroVideoWrapper.style.transform =
                    `translateY(${window.scrollY * -0.2}px)`;
            }
            // Fade out hero content as user scrolls away from section 1
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                const homeSection = document.getElementById('home');
                const sectionHeight = homeSection ? homeSection.offsetHeight : window.innerHeight;
                const fadeStart = sectionHeight * 0.25;
                const fadeEnd   = sectionHeight * 0.65;
                const scrollY   = window.scrollY;
                const opacity   = scrollY <= fadeStart ? 1
                    : scrollY >= fadeEnd   ? 0
                    : 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
                heroContent.style.opacity = opacity;
            }
        }, { passive: true });
    }

    setupParallax() {
        const hands = document.querySelectorAll('.hand');
        const circles = document.querySelectorAll('.circle-bg');
        const stars = document.querySelectorAll('.star');
        const logo = document.querySelector('.logo-container');
        const ctaButton = document.querySelector('.cta-container');
        const circleLines = document.querySelectorAll('.circle-line');
        
        // About section elements
        const aboutElements = document.querySelectorAll('.about-section [data-parallax]');
        
        let ticking = false;

        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateParallax(e, {hands, circles, stars, logo, ctaButton, circleLines, aboutElements});
                    ticking = false;
                });
                ticking = true;
            }
        });

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateScrollParallax({hands, circles, stars, logo, ctaButton, aboutElements});
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateParallax(e, elements) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate mouse position relative to center (-1 to 1)
        const deltaX = (mouseX - centerX) / centerX;
        const deltaY = (mouseY - centerY) / centerY;

        // Parallax for hands - strongest effect (top layer)
        elements.hands.forEach(hand => {
            const moveX = deltaX * 40;
            const moveY = deltaY * 40;
            const rotate = deltaX * 5;
            
            if (hand.classList.contains('hand-left')) {
                hand.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
            } else {
                hand.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${-rotate}deg)`;
            }
        });

        // Parallax for logo - medium effect
        if (elements.logo) {
            const moveX = deltaX * 20;
            const moveY = deltaY * 20;
            elements.logo.style.transform = `translate(calc(-50% + ${moveX}px), ${moveY}px)`;
        }

        // Parallax for circles - subtle effect
        elements.circles.forEach((circle, index) => {
            const depth = (index + 1) * 3;
            const moveX = deltaX * depth;
            const moveY = deltaY * depth;
            circle.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        });

        // Parallax for circle lines
        elements.circleLines.forEach((line, index) => {
            const depth = (index + 1) * 2;
            const moveX = deltaX * depth;
            const moveY = deltaY * depth;
            line.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        });

        // Parallax for stars - rotates but stays on orbit
        elements.stars.forEach((star, index) => {
            const tilt = deltaX * 10;
            star.style.transform = `scale(${1 + (deltaY * 0.1)}) rotate(${tilt}deg)`;
        });

        // Parallax for about section elements
        if (elements.aboutElements && elements.aboutElements.length > 0) {
            elements.aboutElements.forEach(el => {
                const depth = parseFloat(el.dataset.parallax) || 0.5;
                const moveX = deltaX * depth * 10;
                const moveY = deltaY * depth * 10;
                el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        }
    }

    updateScrollParallax(elements) {
        const scrollY = window.scrollY;
        
        // Hands move slower with scroll
        elements.hands.forEach(hand => {
            const moveY = scrollY * 0.3;
            const currentTransform = hand.style.transform || '';
            // Keep mouse parallax, add scroll
            if (currentTransform.includes('translate')) {
                hand.style.transform = currentTransform.replace(/translate\([^)]+\)/, 
                    match => match.replace(/,\s*[^)]+/, `, ${moveY}px`));
            } else {
                hand.style.transform = `translateY(${moveY}px)`;
            }
        });

        // Logo moves faster with scroll
        if (elements.logo && window.innerWidth > 768) {
            const moveY = scrollY * 0.5;
            elements.logo.style.transform = `translate(-50%, ${moveY}px)`;
        }

        // CTA button parallax
        if (elements.ctaButton && window.innerWidth > 768) {
            const moveY = scrollY * 0.4;
            elements.ctaButton.style.transform = `translate(-50%, ${moveY}px)`;
        }

        // Circles move very slowly
        elements.circles.forEach((circle, index) => {
            const moveY = scrollY * (0.1 + index * 0.02);
            circle.style.transform = `translate(-50%, calc(-50% + ${moveY}px))`;
        });

        // About section scroll parallax
        if (elements.aboutElements && elements.aboutElements.length > 0) {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                const sectionTop = aboutSection.offsetTop;
                const sectionHeight = aboutSection.offsetHeight;
                const windowHeight = window.innerHeight;
                
                // Only apply parallax when section is in view
                if (scrollY + windowHeight > sectionTop && scrollY < sectionTop + sectionHeight) {
                    const relativeScroll = scrollY - sectionTop + windowHeight;
                    
                    elements.aboutElements.forEach(el => {
                        const depth = parseFloat(el.dataset.parallax) || 0.5;
                        const moveY = relativeScroll * depth * 0.3;
                        const currentTransform = el.style.transform || '';
                        
                        // Preserve mouse parallax if exists
                        if (currentTransform.includes('translate')) {
                            const translateMatch = currentTransform.match(/translate\(([^)]+)\)/);
                            if (translateMatch) {
                                const [x] = translateMatch[1].split(',');
                                el.style.transform = `translate(${x}, ${moveY}px)`;
                            }
                        } else {
                            el.style.transform = `translateY(${moveY}px)`;
                        }
                    });
                }
            }
        }
    }

    setupScrollEffects() {
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
    }
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}

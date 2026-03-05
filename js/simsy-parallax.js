// Simsy Parallax Effect
(function() {
    'use strict';

    /**
     * Initialize parallax effects for Simsy page
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    /**
     * Setup parallax functionality
     */
    function setup() {
        const heroSection = document.querySelector('.simsy-hero-section');
        const heroVideo = document.querySelector('.simsy-bg-video');
        const heroContent = document.querySelector('.simsy-hero-content');
        
        if (!heroSection || !heroVideo) {
            console.warn('Simsy hero section or video not found');
            return;
        }

        // Check if mobile on load
        const isMobile = window.innerWidth <= 480;
        
        // Don't initialize parallax at all on mobile
        if (isMobile) {
            console.log('Simsy parallax disabled on mobile');
            return;
        }

        // Wait for fade-in animation to complete (1.2s + 0.3s delay = 1.5s)
        setTimeout(() => {
            // Remove animation to allow parallax to take over
            if (heroContent) {
                heroContent.style.animation = 'none';
            }

            // Setup scroll listener for parallax
            let ticking = false;

            window.addEventListener('scroll', () => {
                // Skip if switched to mobile during session
                if (window.innerWidth <= 480) return;
                
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateParallax(heroSection, heroVideo, heroContent);
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // Setup resize listener for responsive adjustments
            let resizeTicking = false;
            window.addEventListener('resize', () => {
                // Skip on mobile
                if (window.innerWidth <= 480) return;
                
                if (!resizeTicking) {
                    window.requestAnimationFrame(() => {
                        updateParallax(heroSection, heroVideo, heroContent);
                        resizeTicking = false;
                    });
                    resizeTicking = true;
                }
            });

            // Initial call
            updateParallax(heroSection, heroVideo, heroContent);

            console.log('Simsy parallax initialized');
        }, 1600);
    }

    /**
     * Get responsive parallax intensity based on screen width
     */
    function getParallaxIntensity() {
        const width = window.innerWidth;
        if (width <= 480) {
            // Mobile - NO parallax for full screen experience
            return { video: 0, title: 0, enabled: false };
        } else if (width <= 768) {
            // Tablet - moderate parallax
            return { video: 0.35, title: 0.5, enabled: true };
        } else if (width <= 1024) {
            // Small desktop - good parallax
            return { video: 0.4, title: 0.7, enabled: true };
        } else {
            // Large desktop - full parallax
            return { video: 0.5, title: 1.0, enabled: true };
        }
    }

    /**
     * Update parallax effect based on scroll position
     */
    function updateParallax(heroSection, heroVideo, heroContent) {
        // Get responsive intensity
        const intensity = getParallaxIntensity();
        
        // Skip parallax on mobile for full screen experience
        if (!intensity.enabled) {
            // Reset transforms on mobile for smooth playback
            if (heroVideo) {
                heroVideo.style.transform = 'translateZ(0)';
                heroVideo.style.webkitTransform = 'translateZ(0)';
            }
            return;
        }
        
        const scrollY = window.scrollY;
        const heroTop = heroSection.offsetTop;
        const heroHeight = heroSection.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate if hero is in viewport
        const heroBottom = heroTop + heroHeight;
        const isInView = scrollY + windowHeight > heroTop && scrollY < heroBottom;

        if (!isInView) return;

        // Calculate scroll progress through hero section
        const scrollProgress = (scrollY - heroTop) / heroHeight;

        // Parallax for video background - moves slower than scroll (no scale)
        const videoTranslate = scrollProgress * 50 * intensity.video;
        if (heroVideo) {
            // Use translate3d for hardware acceleration
            heroVideo.style.transform = `translate3d(0, ${videoTranslate}%, 0)`;
            heroVideo.style.webkitTransform = `translate3d(0, ${videoTranslate}%, 0)`;
        }

        // Parallax for title - moves faster and fades out
        if (heroContent) {
            const titleTranslate = scrollProgress * -30 * intensity.title;
            const titleOpacity = Math.max(0, 1 - scrollProgress * 2);
            heroContent.style.transform = `translate3d(0, ${titleTranslate}%, 0)`;
            heroContent.style.webkitTransform = `translate3d(0, ${titleTranslate}%, 0)`;
            heroContent.style.opacity = titleOpacity;
        }
    }

    // Initialize
    init();
})();

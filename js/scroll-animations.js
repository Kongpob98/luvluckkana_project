// Scroll-triggered animations for About section and Menu section with Parallax (Like Detail Section)
class ScrollAnimations {
    constructor() {
        this.aboutSection = document.querySelector('.about-section');
        this.menuSection = document.querySelector('.menu-section');
        this.menuCards = document.querySelectorAll('.menu-card');
        this.isAboutAnimated = false;
        
        this.init();
    }

    init() {
        // Check if sections are in view on scroll
        window.addEventListener('scroll', () => {
            if (this.aboutSection) {
                this.checkAboutSection();
            }
            if (this.menuSection) {
                this.checkMenuSection();
            }
        });

        // Initial check
        if (this.aboutSection) {
            this.checkAboutSection();
        }
        if (this.menuSection) {
            this.checkMenuSection();
        }

        // Use IntersectionObserver for menu cards (same as Detail Section)
        this.initMenuObserver();
    }

    checkAboutSection() {
        if (this.isAboutAnimated) return;

        const rect = this.aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Trigger when section is 20% visible
        if (rect.top < windowHeight * 0.8) {
            this.isAboutAnimated = true;
            this.aboutSection.classList.add('visible');
        }
    }

    checkMenuSection() {
        const rect = this.menuSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Show background when section enters viewport
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            this.menuSection.classList.add('visible');
        }
        // Hide background when section leaves viewport
        else if (rect.bottom < 0 || rect.top > windowHeight) {
            this.menuSection.classList.remove('visible');
        }
    }

    initMenuObserver() {
        // Same observer options as Detail Section
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    // unobserve after reveal — prevent snap-back on scroll
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all menu cards
        this.menuCards.forEach(card => {
            observer.observe(card);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
});

/**
 * Colors Page - Fixed Position Scroll Experience
 * Content stays in place, changes on scroll
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        totalSections: 9, // intro + 8 color sections
        transitionDuration: 1200, // ms - match CSS transition
    };

    // State
    let currentSectionIndex = 0;
    let isTransitioning = false;
    let allSections = [];

    /**
     * Initialize the color scroll experience
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    }

    /**
     * Setup all functionality
     */
    function setup() {
        // Get all sections (intro + color sections)
        const introSection = document.querySelector('.intro-section');
        const colorSections = Array.from(document.querySelectorAll('.color-section'));
        allSections = [introSection, ...colorSections];

        if (allSections.length === 0) {
            console.warn('No sections found');
            return;
        }

        // Setup scroll listener
        setupScrollListener();
        setupScrollProgress();
        setupKeyboardNavigation();

        // Set initial state - force show first section
        showSection(0, true);
        
        console.log('Colors page initialized with', allSections.length, 'sections');
    }

    /**
     * Setup scroll listener
     */
    function setupScrollListener() {
        let ticking = false;
        const scrollIndicator = document.querySelector('.scroll-indicator');

        window.addEventListener('scroll', () => {
            // Hide scroll indicator after first scroll
            if (scrollIndicator && window.scrollY > 50) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else if (scrollIndicator && window.scrollY <= 50) {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Calculate which section should be active based on scroll position
        // Each section takes up 100vh of scroll space
        const sectionIndex = Math.floor(scrollY / windowHeight);
        const clampedIndex = Math.max(0, Math.min(sectionIndex, CONFIG.totalSections - 1));

        // Update if section changed
        if (clampedIndex !== currentSectionIndex) {
            showSection(clampedIndex);
        }
    }

    /**
     * Show specific section
     */
    function showSection(index, forceUpdate = false) {
        if (!forceUpdate && index === currentSectionIndex) {
            return;
        }

        const previousIndex = currentSectionIndex;
        currentSectionIndex = index;

        // Hide all sections with smooth transitions
        allSections.forEach((section, i) => {
            if (i === index) {
                section.classList.add('active');
                section.classList.remove('hidden');
            } else if (i === previousIndex) {
                section.classList.add('hidden');
                section.classList.remove('active');
            } else {
                section.classList.remove('active', 'hidden');
            }
        });

        // Update background color
        updateBackgroundColor(index);
    }

    /**
     * Update background color based on active section
     * Keep background black always
     */
    function updateBackgroundColor(index) {
        const section = allSections[index];
        if (!section) return;

        // Keep background black always
        document.body.style.backgroundColor = '#000000';
    }

    /**
     * Setup scroll progress indicator
     */
    function setupScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            // Calculate total scrollable height
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / totalHeight) * 100;

            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }, { passive: true });
    }

    /**
     * Keyboard navigation
     */
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const windowHeight = window.innerHeight;
            
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                const nextIndex = Math.min(currentSectionIndex + 1, CONFIG.totalSections - 1);
                window.scrollTo({
                    top: nextIndex * windowHeight,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                const prevIndex = Math.max(currentSectionIndex - 1, 0);
                window.scrollTo({
                    top: prevIndex * windowHeight,
                    behavior: 'smooth'
                });
            } else if (e.key === 'Home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (e.key === 'End') {
                e.preventDefault();
                window.scrollTo({
                    top: (CONFIG.totalSections - 1) * windowHeight,
                    behavior: 'smooth'
                });
            }
        });
    }

    /**
     * Performance optimization
     */
    function optimizePerformance() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.body.classList.add('reduce-motion');
            CONFIG.transitionDuration = 300;
        }
    }

    /**
     * Setup page transitions
     */
    function setupPageTransitions() {
        document.body.style.transition = `background-color ${CONFIG.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    }

    // Initialize
    optimizePerformance();
    setupPageTransitions();
    init();

    // Expose API
    window.ColorsPage = {
        goToSection: (index) => {
            const windowHeight = window.innerHeight;
            window.scrollTo({
                top: index * windowHeight,
                behavior: 'smooth'
            });
        },
        getCurrentSection: () => currentSectionIndex,
        getTotalSections: () => CONFIG.totalSections
    };

})();

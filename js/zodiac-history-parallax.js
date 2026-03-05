// Zodiac History Section - Sticky Scroll Experience
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        totalSections: 5, // intro + 4 content sections
    };

    // State
    let currentHistoryIndex = 0;
    let allHistorySections = [];
    let historyWrapper = null;
    let historyBg = null;
    let isScrolling = false;

    /**
     * Initialize the history sticky scroll experience
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
        // Get wrapper
        historyWrapper = document.querySelector('.zodiac-history-wrapper');
        if (!historyWrapper) {
            console.warn('History wrapper not found');
            return;
        }

        // Get background element
        historyBg = document.querySelector('.zodiac-history-bg');

        // Get all history sections
        const introSection = document.querySelector('.history-intro-section');
        const contentSections = Array.from(document.querySelectorAll('.history-content-section'));
        allHistorySections = [introSection, ...contentSections].filter(s => s !== null);

        if (allHistorySections.length === 0) {
            console.warn('No history sections found');
            return;
        }

        // Setup scroll listener
        setupScrollListener();
        setupKeyboardNavigation();

        // Set initial state - check if already in view
        const wrapperTop = historyWrapper.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (wrapperTop < windowHeight * 0.5) {
            // Already in view, show first section
            showHistorySection(0, true);
            if (historyBg) {
                historyBg.classList.add('visible');
            }
        } else {
            // Not in view yet, hide all
            hideAllHistorySections();
        }
        
        console.log('History sticky scroll initialized with', allHistorySections.length, 'sections');
    }

    /**
     * Setup scroll listener
     */
    function setupScrollListener() {
        let ticking = false;
        const scrollHint = document.querySelector('.scroll-hint');

        window.addEventListener('scroll', () => {
            // Hide scroll hint after first scroll
            if (scrollHint) {
                const wrapperTop = historyWrapper.getBoundingClientRect().top;
                const scrollIntoWrapper = wrapperTop < window.innerHeight / 2;
                
                if (scrollIntoWrapper) {
                    scrollHint.style.opacity = '0';
                    scrollHint.style.pointerEvents = 'none';
                } else {
                    scrollHint.style.opacity = '1';
                    scrollHint.style.pointerEvents = 'auto';
                }
            }

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleHistoryScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Handle scroll events for history section
     */
    function handleHistoryScroll() {
        if (!historyWrapper) return;

        const wrapperTop = historyWrapper.getBoundingClientRect().top;
        const wrapperHeight = historyWrapper.offsetHeight;
        const windowHeight = window.innerHeight;

        // Check if we're in the history wrapper area
        // Start showing when wrapper is near the viewport, not just when at top
        const isInWrapper = wrapperTop < windowHeight * 0.5 && wrapperTop > -wrapperHeight + windowHeight * 0.5;
        
        if (isInWrapper) {
            // Show background
            if (historyBg) {
                historyBg.classList.add('visible');
            }
            
            // Calculate which section should be active based on scroll position within wrapper
            const scrolledIntoWrapper = Math.max(0, -wrapperTop + windowHeight * 0.5);
            const sectionIndex = Math.floor(scrolledIntoWrapper / windowHeight);
            const clampedIndex = Math.max(0, Math.min(sectionIndex, CONFIG.totalSections - 1));

            // Update if section changed
            if (clampedIndex !== currentHistoryIndex) {
                showHistorySection(clampedIndex);
            }
            // Make sure we show current section if none is showing
            else if (!allHistorySections[clampedIndex]?.classList.contains('active')) {
                showHistorySection(clampedIndex, true);
            }
        } else {
            // Hide background
            if (historyBg) {
                historyBg.classList.remove('visible');
            }
            
            // Hide all sections when outside wrapper
            hideAllHistorySections();
        }
    }

    /**
     * Show specific history section
     */
    function showHistorySection(index, forceUpdate = false) {
        if (!forceUpdate && index === currentHistoryIndex) {
            return;
        }

        const previousIndex = currentHistoryIndex;
        currentHistoryIndex = index;

        // Update sections visibility
        allHistorySections.forEach((section, i) => {
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
    }

    /**
     * Hide all history sections (when outside wrapper)
     */
    function hideAllHistorySections() {
        allHistorySections.forEach((section) => {
            section.classList.remove('active');
            section.classList.add('hidden');
        });
    }

    /**
     * Keyboard navigation for history section
     */
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!historyWrapper) return;

            // Only handle keys when in history wrapper view
            const wrapperTop = historyWrapper.getBoundingClientRect().top;
            const wrapperHeight = historyWrapper.offsetHeight;
            const windowHeight = window.innerHeight;

            if (wrapperTop <= 0 && wrapperTop > -wrapperHeight + windowHeight) {
                const wrapperScrollTop = historyWrapper.offsetTop;

                if (e.key === 'ArrowDown' && currentHistoryIndex < CONFIG.totalSections - 1) {
                    e.preventDefault();
                    const nextIndex = currentHistoryIndex + 1;
                    window.scrollTo({
                        top: wrapperScrollTop + (nextIndex * windowHeight),
                        behavior: 'smooth'
                    });
                } else if (e.key === 'ArrowUp' && currentHistoryIndex > 0) {
                    e.preventDefault();
                    const prevIndex = currentHistoryIndex - 1;
                    window.scrollTo({
                        top: wrapperScrollTop + (prevIndex * windowHeight),
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // Initialize
    init();

})();

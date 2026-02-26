// Zodiac Section 3 - Enhanced Effects & Parallax
(function() {
    const section3 = document.querySelector('.zodiac-header-section');
    const headerContainer = document.querySelector('.zodiac-header-container');
    const titleLogo = document.querySelector('.zodiac-header-title');
    const brandLogo = document.querySelector('.zodiac-header-brand');
    const divider = document.querySelector('.zodiac-header-divider');
    const cardsScroll = document.querySelector('.zodiac-cards-scroll');

    if (!section3) return;

    let ticking = false;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    // Smooth interpolation function (lerp)
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Easing function
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // Scroll-based parallax for Section 3
    function updateScrollParallax() {
        const scrolled = window.pageYOffset;
        const sectionTop = section3.offsetTop;
        const sectionHeight = section3.offsetHeight;
        const windowHeight = window.innerHeight;

        // Only apply when section is in viewport
        if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
            const offset = scrolled - sectionTop + windowHeight;
            const progress = Math.min(Math.max(offset / (sectionHeight + windowHeight), 0), 1);
            const easedProgress = easeOutCubic(progress);

            // Parallax for background pseudo-elements (via CSS variables)
            section3.style.setProperty('--scroll-progress', progress);

            // Subtle parallax for header container with smooth transitions
            if (headerContainer) {
                const containerMove = -(offset * 0.04);
                const containerScale = 0.98 + (easedProgress * 0.04);
                headerContainer.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                headerContainer.style.transform = `translate3d(0, ${containerMove}px, 0) scale(${containerScale})`;
                headerContainer.style.opacity = 0.85 + (easedProgress * 0.15);
            }

            // Parallax for cards scroll container with smooth transitions
            if (cardsScroll) {
                const cardsMove = -(offset * 0.02);
                cardsScroll.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                cardsScroll.style.transform = `translate3d(0, ${cardsMove}px, 0)`;
            }
        }

        ticking = false;
    }

    // Mouse parallax effect for desktop - DISABLED for logos
    if (window.innerWidth > 768) {
        let animationId = null;

        function animateMouseParallax() {
            // Smooth interpolation
            mouseX = lerp(mouseX, targetMouseX, 0.08);
            mouseY = lerp(mouseY, targetMouseY, 0.08);

            // Logo animations disabled - keeping original position

            // Continue animation loop
            animationId = requestAnimationFrame(animateMouseParallax);
        }

        // Mouse move tracking
        section3.addEventListener('mouseenter', () => {
            if (!animationId) {
                animationId = requestAnimationFrame(animateMouseParallax);
            }
        });

        section3.addEventListener('mousemove', (e) => {
            const rect = section3.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            targetMouseX = ((x - centerX) / centerX) * 60;
            targetMouseY = ((y - centerY) / centerY) * 60;
        });

        section3.addEventListener('mouseleave', () => {
            targetMouseX = 0;
            targetMouseY = 0;
            
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            // Logo reset disabled - keeping original position
        });
    }

    // Scroll event listener for parallax
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollParallax();
            });
            ticking = true;
        }
    });

    // Initial call
    updateScrollParallax();

    // Enhanced card hover effect with neighbor influence
    if (cardsScroll) {
        const cards = cardsScroll.querySelectorAll('.zodiac-card-item');
        
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                // Scale down neighbors slightly with smooth easing
                cards.forEach((otherCard, otherIndex) => {
                    if (otherIndex !== index) {
                        const distance = Math.abs(otherIndex - index);
                        const scale = 1 - (distance === 1 ? 0.02 : 0.005);
                        const opacity = distance === 1 ? 0.85 : 0.95;
                        
                        otherCard.style.transform = `scale(${scale})`;
                        otherCard.style.opacity = opacity;
                        otherCard.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                // Reset all cards smoothly
                cards.forEach((otherCard) => {
                    otherCard.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    otherCard.style.transform = '';
                    otherCard.style.opacity = '';
                });
            });
        });

        // Enhanced smooth scroll with mouse wheel on cards
        let isScrolling = false;
        let scrollTarget = cardsScroll.scrollLeft;
        
        cardsScroll.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                
                // Calculate smooth scroll target
                scrollTarget += e.deltaY * 1.2;
                scrollTarget = Math.max(0, Math.min(scrollTarget, cardsScroll.scrollWidth - cardsScroll.clientWidth));
                
                // Smooth scroll animation
                if (!isScrolling) {
                    isScrolling = true;
                    smoothScrollTo(cardsScroll, scrollTarget);
                }
            }
        }, { passive: false });
        
        function smoothScrollTo(element, target) {
            const start = element.scrollLeft;
            const distance = target - start;
            const duration = 400;
            let startTime = null;
            
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easing = 1 - Math.pow(1 - progress, 3);
                element.scrollLeft = start + (distance * easing);
                
                if (progress < 1) {
                    requestAnimationFrame(animation);
                } else {
                    isScrolling = false;
                }
            }
            
            requestAnimationFrame(animation);
        }
    }

    // Intersection Observer for section entrance animation
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section3.style.animation = 'fadeInUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            }
        });
    }, observerOptions);

    sectionObserver.observe(section3);

    // Add CSS animation if not exists
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

})();

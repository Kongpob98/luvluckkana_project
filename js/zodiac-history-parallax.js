// Zodiac History Section - Parallax & Scroll Animation
(function() {
    const historySection = document.querySelector('.zodiac-history-section');
    const historyContent = document.querySelector('.zodiac-history-content');
    const cubeStrips = document.querySelector('.zodiac-cube-strips');
    const ellipseGlow = document.querySelector('.zodiac-ellipse-glow');

    if (!historySection || !historyContent) return;

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                historyContent.classList.add('animate-in');
            }
        });
    }, observerOptions);

    scrollObserver.observe(historyContent);

    // Parallax Effect on Scroll
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const sectionTop = historySection.offsetTop;
        const sectionHeight = historySection.offsetHeight;
        const windowHeight = window.innerHeight;

        // Only apply parallax when section is in view
        if (scrolled + windowHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
            const offset = scrolled - sectionTop + windowHeight;
            const progress = offset / (sectionHeight + windowHeight);

            // Parallax for cube strips (slower movement)
            if (cubeStrips) {
                const cubeMove = -(offset * 0.15);
                cubeStrips.style.transform = `translate3d(0, ${cubeMove}px, 0)`;
            }

            // Parallax for ellipse glow (different speed + rotation)
            if (ellipseGlow) {
                const ellipseMove = -(offset * 0.25);
                const rotation = -10.37 + (progress * 15); // Rotate based on scroll
                ellipseGlow.style.transform = `translate3d(0, ${ellipseMove}px, 0) rotate(${rotation}deg)`;
            }

            // Parallax for content (subtle)
            if (historyContent) {
                const contentMove = -(offset * 0.05);
                historyContent.style.transform = `translate3d(0, ${contentMove}px, 0)`;
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
            });
            ticking = true;
        }
    });

    // Initial call
    updateParallax();

    // Mouse parallax effect (optional - subtle movement on mouse move)
    if (window.innerWidth > 768) {
        historySection.addEventListener('mousemove', (e) => {
            const rect = historySection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / centerX * 20;
            const moveY = (y - centerY) / centerY * 20;

            if (ellipseGlow) {
                ellipseGlow.style.transform = `
                    translate3d(${moveX}px, ${moveY}px, 0)
                    rotate(-10.37deg)
                `;
            }
        });

        historySection.addEventListener('mouseleave', () => {
            if (ellipseGlow) {
                ellipseGlow.style.transform = 'translate3d(0, 0, 0) rotate(-10.37deg)';
            }
        });
    }
})();

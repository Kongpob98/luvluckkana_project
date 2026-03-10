/**
 * about-parallax.js
 * Parallax & scroll-reveal effects for pages/about.html
 *
 * Approach:
 *  - IntersectionObserver  → fade/slide-in on enter (section reveals)
 *  - requestAnimationFrame → smooth parallax on scroll
 *  - No external library, pure vanilla JS
 *  - Respects prefers-reduced-motion
 */

(function () {
    'use strict';

    /* ─────────────────────────────────────────────────────────────
       0. REDUCED MOTION — bail out of all motion if user prefers
    ───────────────────────────────────────────────────────────── */
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    /* ─────────────────────────────────────────────────────────────
       1. SCROLL REVEAL — Bidirectional
         Adds  ap-visible  when element enters viewport (scroll down)
         Removes ap-visible when element leaves viewport (scroll up)
         → Elements animate IN on scroll down, OUT on scroll back up

         .ap-reveal                = observer target (starts hidden)
         .ap-slide-up / left / right = direction modifier
         data-ap-delay="200"       = stagger delay in ms (enter only)
    ───────────────────────────────────────────────────────────── */
    // Track pending timers so we can cancel on scroll-back
    const revealTimers = new WeakMap();

    function initReveal() {
        const items = document.querySelectorAll('.ap-reveal');
        if (!items.length) return;

        if (prefersReducedMotion) {
            items.forEach(el => el.classList.add('ap-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el    = entry.target;
                const delay = parseInt(el.dataset.apDelay || '0', 10);

                if (entry.isIntersecting) {
                    // Entering viewport → cancel any exit, then reveal
                    el.classList.remove('ap-exiting');
                    const pending = revealTimers.get(el);
                    if (pending !== undefined) {
                        clearTimeout(pending);
                    }
                    const tid = setTimeout(() => {
                        el.classList.add('ap-visible');
                        revealTimers.delete(el);
                    }, delay);
                    revealTimers.set(el, tid);
                } else {
                    // Leaving viewport → cancel pending reveal, fade out IN PLACE
                    const pending = revealTimers.get(el);
                    if (pending !== undefined) {
                        clearTimeout(pending);
                        revealTimers.delete(el);
                    }
                    // Add exiting class first so position locks at translate(0,0)
                    el.classList.add('ap-exiting');
                    el.classList.remove('ap-visible');
                    // After fade-out transition, reset to slide-start so next entry slides in
                    const tid = setTimeout(() => {
                        el.classList.remove('ap-exiting');
                    }, 1250);
                    revealTimers.set(el, tid);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        items.forEach(el => observer.observe(el));
    }

    /* ─────────────────────────────────────────────────────────────
       2. PARALLAX ON SCROLL
         data-ap-parallax="speed"  (e.g. 0.3 = 30% of scroll offset)
         Positive → moves DOWN slower than page (bg layers)
         Negative → moves UP against scroll (floating elements)
    ───────────────────────────────────────────────────────────── */
    const parallaxEls = [];

    function collectParallax() {
        document.querySelectorAll('[data-ap-parallax]').forEach(el => {
            parallaxEls.push({
                el,
                speed: parseFloat(el.dataset.apParallax) || 0.3,
            });
        });
    }

    function updateParallax() {
        const scrollY = window.scrollY;
        parallaxEls.forEach(({ el, speed }) => {
            const rect = el.getBoundingClientRect();
            const inView =
                rect.bottom > 0 && rect.top < window.innerHeight * 1.5;
            if (!inView) return;

            const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
            el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        });
    }

    /* ─────────────────────────────────────────────────────────────
       3. GLOW BLOB MOUSE PARALLAX (S1 hero)
         Glow blobs follow mouse movement slightly for depth
    ───────────────────────────────────────────────────────────── */
    function initMouseParallax() {
        const hero = document.querySelector('.about-hero');
        if (!hero) return;

        const blob  = hero.querySelector('.about-hero-glow');
        const bg    = hero.querySelector('.about-hero-bg');
        if (!blob && !bg) return;

        let mouseX = 0.5, mouseY = 0.5;
        let currentX = 0.5, currentY = 0.5;
        let rafId = null;

        hero.addEventListener('mousemove', e => {
            const rect = hero.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top)  / rect.height;
        });

        hero.addEventListener('mouseleave', () => {
            mouseX = 0.5; mouseY = 0.5;
        });

        function tick() {
            // Ease toward cursor
            currentX += (mouseX - currentX) * 0.06;
            currentY += (mouseY - currentY) * 0.06;

            const dx = (currentX - 0.5) * 40; // max ±20px
            const dy = (currentY - 0.5) * 30;

            if (blob) {
                blob.style.transform =
                    `translate3d(${dx}px, ${dy}px, 0)`;
            }
            if (bg) {
                bg.style.transform =
                    `translate3d(${dx * 0.4}px, ${dy * 0.4}px, 0)`;
            }

            rafId = requestAnimationFrame(tick);
        }

        tick();
    }

    /* ─────────────────────────────────────────────────────────────
       4. SKILLS ORBITAL SLOW ROTATION ON SCROLL
    ───────────────────────────────────────────────────────────── */
    function initOrbitalScroll() {
        const orbital = document.querySelector('.skills-orbital');
        if (!orbital) return;

        let lastAngle = 0;
        function onScroll() {
            const rect = orbital.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const progress = (window.innerHeight / 2 - center) / (window.innerHeight);
            const angle = progress * 18; // ±18deg rotation
            if (Math.abs(angle - lastAngle) < 0.05) return;
            lastAngle = angle;
            orbital.style.transform = `rotate(${angle}deg)`;
        }

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ─────────────────────────────────────────────────────────────
       5. SECTION GLOW BLOB PARALLAX (S4, S5)
         Glow divs move slower than section scroll
    ───────────────────────────────────────────────────────────── */
    function initGlowParallax() {
        const glows = document.querySelectorAll(
            '.s4-glow-purple, .s4-glow-white, .s5-glow-purple, .s5-glow-white'
        );
        glows.forEach(el => {
            el.dataset.apParallax = '-0.18';
            parallaxEls.push({ el, speed: -0.18 });
        });
    }

    /* ─────────────────────────────────────────────────────────────
       6. CARD HOVER 3D TILT (S4 cards)
         Uses lerp + RAF so the card eases smoothly toward the cursor
         instead of snapping directly — gives a fluid, springy feel.
    ───────────────────────────────────────────────────────────── */
    function initCardTilt() {
        const LERP    = 0.07;   // easing factor (lower = slower/smoother)
        const MAX_RY  = 10;     // max rotateY degrees
        const MAX_RX  = 8;      // max rotateX degrees
        const SCALE   = 1.03;

        document.querySelectorAll('.s4-card').forEach(card => {
            // Current (displayed) and target rotation values
            let curRx = 0, curRy = 0;
            let tgtRx = 0, tgtRy = 0;
            let rafId = null;
            let isHovered = false;

            function tick() {
                // Lerp current toward target
                curRx += (tgtRx - curRx) * LERP;
                curRy += (tgtRy - curRy) * LERP;

                const sc = isHovered
                    ? SCALE + (SCALE - 1) * Math.min(Math.abs(curRx / MAX_RX), Math.abs(curRy / MAX_RY))
                    : 1 + (Math.abs(curRx) + Math.abs(curRy)) / (MAX_RX + MAX_RY) * (SCALE - 1);

                card.style.transform =
                    `perspective(800px) rotateY(${curRy}deg) rotateX(${curRx}deg) scale3d(${sc},${sc},${sc})`;

                // Keep looping until close enough to rest
                const stillMoving = Math.abs(tgtRx - curRx) > 0.01 || Math.abs(tgtRy - curRy) > 0.01;
                if (stillMoving) {
                    rafId = requestAnimationFrame(tick);
                } else {
                    // Snap to final target and stop loop
                    curRx = tgtRx;
                    curRy = tgtRy;
                    if (!isHovered) {
                        card.style.transform = '';
                    }
                    rafId = null;
                }
            }

            function startRaf() {
                if (!rafId) rafId = requestAnimationFrame(tick);
            }

            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const cx   = (e.clientX - rect.left) / rect.width  - 0.5;
                const cy   = (e.clientY - rect.top)  / rect.height - 0.5;
                tgtRy =  cx * MAX_RY;
                tgtRx = -cy * MAX_RX;
                isHovered = true;
                startRaf();
            });

            card.addEventListener('mouseleave', () => {
                tgtRx = 0;
                tgtRy = 0;
                isHovered = false;
                startRaf();
            });
        });
    }

    /* ─────────────────────────────────────────────────────────────
       7. AVATAR FLOAT ANIMATION (S2)
         Each avatar gets a slightly different float phase
    ───────────────────────────────────────────────────────────── */
    function initAvatarFloat() {
        document.querySelectorAll('.team-avatar').forEach((el, i) => {
            const delay    = i * 0.6;
            const duration = 3.5 + i * 0.4;
            const dist     = 8 + i * 2; // px
            el.style.animation =
                `aboutFloat ${duration}s ease-in-out ${delay}s infinite`;
            el.style.setProperty('--float-dist', `${dist}px`);
        });
    }

    /* ─────────────────────────────────────────────────────────────
       8. RAF LOOP — runs parallax every frame while scrolling
    ───────────────────────────────────────────────────────────── */
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    }

    /* ─────────────────────────────────────────────────────────────
       9. BOOT
    ───────────────────────────────────────────────────────────── */
    function boot() {
        initReveal();
        collectParallax();
        initGlowParallax();

        if (!prefersReducedMotion) {
            initMouseParallax();
            initOrbitalScroll();
            initCardTilt();
            initAvatarFloat();
            window.addEventListener('scroll', onScroll, { passive: true });
            updateParallax(); // initial render
        }

        console.log('[about-parallax] initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();

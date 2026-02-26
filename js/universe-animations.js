// Universe Section Animations
// Scroll-triggered animations and parallax effects

document.addEventListener('DOMContentLoaded', function() {
    
    // Scroll Animation Observer
    const scrollAnimateElements = document.querySelectorAll('.scroll-animate');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    scrollAnimateElements.forEach(element => {
        scrollObserver.observe(element);
    });
    
    // Parallax Effect for Universe Layers
    const universeSection = document.querySelector('.universe-section');
    const universeLayers = document.querySelectorAll('.universe-layer');
    
    if (universeSection && universeLayers.length > 0) {
        window.addEventListener('scroll', () => {
            const rect = universeSection.getBoundingClientRect();
            const scrollPercentage = 1 - (rect.top / window.innerHeight);
            
            if (scrollPercentage > 0 && scrollPercentage < 2) {
                universeLayers.forEach((layer) => {
                    const speed = parseFloat(layer.dataset.speed) || 0.5;
                    const yPos = -(scrollPercentage * 100 * speed);
                    layer.style.transform = `translateY(${yPos}px)`;
                });
            }
        });
    }
    
    // Enhanced Floating Stars with Mouse Parallax
    const floatingElements = document.querySelector('.universe-floating-elements');
    
    if (floatingElements && universeSection) {
        universeSection.addEventListener('mousemove', (e) => {
            const rect = universeSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            const floatingStars = floatingElements.querySelectorAll('.floating-star');
            floatingStars.forEach((star, index) => {
                const speed = (index % 2 === 0) ? 20 : -20;
                const xMove = (x - 0.5) * speed;
                const yMove = (y - 0.5) * speed;
                
                star.style.transform = `translate(${xMove}px, ${yMove}px)`;
            });
        });
        
        universeSection.addEventListener('mouseleave', () => {
            const floatingStars = floatingElements.querySelectorAll('.floating-star');
            floatingStars.forEach((star) => {
                star.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Smooth Scroll to Universe Section
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && universeSection) {
        // Add secondary action for scrolling (optional)
        const scrollHint = document.createElement('div');
        scrollHint.className = 'scroll-hint';
        scrollHint.innerHTML = '<i class="fas fa-chevron-down"></i>';
        scrollHint.style.cssText = `
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: rgba(255, 255, 255, 0.6);
            font-size: 24px;
            cursor: pointer;
            z-index: 100;
            animation: bounce 2s infinite;
        `;
        
        // Add bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(10px); }
            }
        `;
        document.head.appendChild(style);
        
        scrollHint.addEventListener('click', () => {
            universeSection.scrollIntoView({ behavior: 'smooth' });
        });
        
        const homeContainer = document.querySelector('.home-container');
        if (homeContainer) {
            homeContainer.appendChild(scrollHint);
        }
    }
});

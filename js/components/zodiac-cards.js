// Zodiac Cards Component
// 12 Zodiac Cards with 3D Carousel Navigation
// Glass-morphism design with infinite loop

document.addEventListener('DOMContentLoaded', function() {
    const zodiacCarousel = document.getElementById('zodiac-cards-carousel');
    
    if (!zodiacCarousel) return;

    // 12 Zodiac Signs Data
    const zodiacData = [
        { 
            id: 1, 
            name: 'Aries', 
            thaiName: 'ราศีเมษ', 
            dates: 'Mar 21 - Apr 19',
            symbol: '♈',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Aries.png'
        },
        { 
            id: 2, 
            name: 'Taurus', 
            thaiName: 'ราศีพฤษภ', 
            dates: 'Apr 20 - May 20',
            symbol: '♉',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Taurus.png'
        },
        { 
            id: 3, 
            name: 'Gemini', 
            thaiName: 'ราศีเมถุน', 
            dates: 'May 21 - Jun 20',
            symbol: '♊',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Gemini.png'
        },
        { 
            id: 4, 
            name: 'Cancer', 
            thaiName: 'ราศีกรกฎ', 
            dates: 'Jun 21 - Jul 22',
            symbol: '♋',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Cancer.png'
        },
        { 
            id: 5, 
            name: 'Leo', 
            thaiName: 'ราศีสิงห์', 
            dates: 'Jul 23 - Aug 22',
            symbol: '♌',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Leo.png'
        },
        { 
            id: 6, 
            name: 'Virgo', 
            thaiName: 'ราศีกันย์', 
            dates: 'Aug 23 - Sep 22',
            symbol: '♍',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Vigro.png'
        },
        { 
            id: 7, 
            name: 'Libra', 
            thaiName: 'ราศีตุลย์', 
            dates: 'Sep 23 - Oct 22',
            symbol: '♎',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Libra.png'
        },
        { 
            id: 8, 
            name: 'Scorpio', 
            thaiName: 'ราศีพิจิก', 
            dates: 'Oct 23 - Nov 21',
            symbol: '♏',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Scorpio.png'
        },
        { 
            id: 9, 
            name: 'Sagittarius', 
            thaiName: 'ราศีธนู', 
            dates: 'Nov 22 - Dec 21',
            symbol: '♐',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Sagittarius.png'
        },
        { 
            id: 10, 
            name: 'Capricorn', 
            thaiName: 'ราศีมกร', 
            dates: 'Dec 22 - Jan 19',
            symbol: '♑',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Capricorn.png'
        },
        { 
            id: 11, 
            name: 'Aquarius', 
            thaiName: 'ราศีกุมภ์', 
            dates: 'Jan 20 - Feb 18',
            symbol: '♒',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Aquarius.png'
        },
        { 
            id: 12, 
            name: 'Pisces', 
            thaiName: 'ราศีมีน', 
            dates: 'Feb 19 - Mar 20',
            symbol: '♓',
            image: 'https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Pisces.png'
        }
    ];

    // Create Cards HTML
    const cardsHTML = zodiacData.map((zodiac) => {
        return `
            <div class="zodiac-card-item" data-zodiac-id="${zodiac.id}">
                <!-- Image Container -->
                <div class="zodiac-card-image">
                    <img src="${zodiac.image}" alt="${zodiac.name}" />
                </div>
                
                <!-- Card Info -->
                <div class="zodiac-card-info">
                    <h3 class="zodiac-card-name">${zodiac.name}</h3>
                    <p class="zodiac-card-thai-name">${zodiac.thaiName}</p>
                    <p class="zodiac-card-dates">${zodiac.dates}</p>
                </div>
            </div>
        `;
    }).join('');

    // Insert cards into carousel track
    zodiacCarousel.innerHTML = cardsHTML;

    // 3D Carousel Controller
    const carousel3D = {
        currentIndex: 0,
        totalCards: zodiacData.length,
        cards: [],
        indicators: [],
        isAnimating: false,
        autoPlayInterval: null,
        wheelAccumulator: 0,
        wheelTimeout: null,

        init() {
            this.cards = Array.from(document.querySelectorAll('.zodiac-card-item'));
            this.createIndicators();
            this.updateCarousel();
            this.bindEvents();
            // Start auto-play (optional)
            // this.startAutoPlay();
        },

        createIndicators() {
            const indicatorsContainer = document.getElementById('zodiac-carousel-indicators');
            if (!indicatorsContainer) return;
            
            // Create indicator dots
            for (let i = 0; i < this.totalCards; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-indicator-dot';
                dot.setAttribute('data-index', i);
                
                // Click to navigate
                dot.addEventListener('click', () => this.goTo(i));
                
                indicatorsContainer.appendChild(dot);
                this.indicators.push(dot);
            }
        },

        updateIndicators() {
            this.indicators.forEach((dot, index) => {
                if (index === this.currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        },

        updateCarousel() {
            this.cards.forEach((card, index) => {
                // Remove all position classes
                card.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2', 'hidden');
                
                // Calculate position relative to current index
                let position = (index - this.currentIndex + this.totalCards) % this.totalCards;
                
                // Apply position class
                if (position === 0) {
                    card.classList.add('active');
                } else if (position === 1) {
                    card.classList.add('right-1');
                } else if (position === 2) {
                    card.classList.add('right-2');
                } else if (position === this.totalCards - 1) {
                    card.classList.add('left-1');
                } else if (position === this.totalCards - 2) {
                    card.classList.add('left-2');
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Update indicators
            this.updateIndicators();
        },

        next() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            this.currentIndex = (this.currentIndex + 1) % this.totalCards;
            this.updateCarousel();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 600);
        },

        prev() {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
            this.updateCarousel();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 600);
        },

        goTo(index) {
            if (this.isAnimating || index === this.currentIndex) return;
            this.isAnimating = true;
            
            this.currentIndex = index;
            this.updateCarousel();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 600);
        },

        bindEvents() {
            // Navigation buttons
            const prevBtn = document.querySelector('.carousel-nav-prev');
            const nextBtn = document.querySelector('.carousel-nav-next');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.prev());
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.next());
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    this.next();
                }
            });

            // Click on active card (optional: add modal or navigation)
            this.cards.forEach((card, index) => {
                card.addEventListener('click', () => {
                    if (card.classList.contains('active')) {
                        const zodiacId = card.getAttribute('data-zodiac-id');
                        const zodiac = zodiacData.find(z => z.id === parseInt(zodiacId));
                        console.log('Clicked active zodiac:', zodiac.name);
                        // You can add navigation or modal functionality here
                    } else {
                        // Click to navigate to this card
                        this.goTo(index);
                    }
                });
            });

            // Touch/Swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            zodiacCarousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            zodiacCarousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });

            this.handleSwipe = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
            };

            // Mouse Wheel Support
            const carouselContainer = document.querySelector('.carousel-3d-container');
            if (carouselContainer) {
                carouselContainer.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    
                    // Accumulate wheel delta
                    this.wheelAccumulator += e.deltaY;
                    
                    // Clear previous timeout
                    if (this.wheelTimeout) {
                        clearTimeout(this.wheelTimeout);
                    }
                    
                    // Set threshold for navigation (adjust for sensitivity)
                    const threshold = 100;
                    
                    if (Math.abs(this.wheelAccumulator) >= threshold) {
                        if (this.wheelAccumulator > 0) {
                            this.next();
                        } else {
                            this.prev();
                        }
                        this.wheelAccumulator = 0;
                    }
                    
                    // Reset accumulator after no wheel activity
                    this.wheelTimeout = setTimeout(() => {
                        this.wheelAccumulator = 0;
                    }, 200);
                }, { passive: false });
            }
        },

        startAutoPlay(interval = 5000) {
            this.stopAutoPlay();
            this.autoPlayInterval = setInterval(() => {
                this.next();
            }, interval);
        },

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }
    };

    // Initialize carousel
    carousel3D.init();
});

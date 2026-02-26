// 12 Zodiac Grid Component
// Based on Figma design with overlapping card layout

document.addEventListener('DOMContentLoaded', function() {
    const zodiacGridContainer = document.getElementById('zodiac-grid');
    
    if (!zodiacGridContainer) return;

    // 12 Zodiac Signs Data with accurate dates
    const zodiacData = [
        { 
            id: 1, 
            name: 'Aries', 
            thaiName: 'ราศีเมษ', 
            dates: 'Mar 21 - Apr 19',
            image: '../assets/images/zodiac-1.png',
            isCenter: false
        },
        { 
            id: 2, 
            name: 'Taurus', 
            thaiName: 'ราศีพฤษภ', 
            dates: 'Apr 20 - May 20',
            image: '../assets/images/zodiac-2.png',
            isCenter: false
        },
        { 
            id: 3, 
            name: 'Gemini', 
            thaiName: 'ราศีเมถุน', 
            dates: 'May 21 - Jun 20',
            image: '../assets/images/zodiac-3.png',
            isCenter: false
        },
        { 
            id: 4, 
            name: 'Cancer', 
            thaiName: 'ราศีกรกฎ', 
            dates: 'Jun 21 - Jul 22',
            image: '../assets/images/zodiac-4.png',
            isCenter: true
        },
        { 
            id: 5, 
            name: 'Leo', 
            thaiName: 'ราศีสิงห์', 
            dates: 'Jul 23 - Aug 22',
            image: '../assets/images/zodiac-5.png',
            isCenter: false
        },
        { 
            id: 6, 
            name: 'Virgo', 
            thaiName: 'ราศีกันย์', 
            dates: 'Aug 23 - Sep 22',
            image: '../assets/images/zodiac-6.png',
            isCenter: false
        },
        { 
            id: 7, 
            name: 'Libra', 
            thaiName: 'ราศีตุลย์', 
            dates: 'Sep 23 - Oct 22',
            image: '../assets/images/zodiac-7.png',
            isCenter: false
        },
        { 
            id: 8, 
            name: 'Scorpio', 
            thaiName: 'ราศีพิจิก', 
            dates: 'Oct 23 - Nov 21',
            image: '../assets/images/zodiac-8.png',
            isCenter: false
        },
        { 
            id: 9, 
            name: 'Sagittarius', 
            thaiName: 'ราศีธนู', 
            dates: 'Nov 22 - Dec 21',
            image: '../assets/images/zodiac-9.png',
            isCenter: false
        },
        { 
            id: 10, 
            name: 'Capricorn', 
            thaiName: 'ราศีมกร', 
            dates: 'Dec 22 - Jan 19',
            image: '../assets/images/zodiac-10.png',
            isCenter: false
        },
        { 
            id: 11, 
            name: 'Aquarius', 
            thaiName: 'ราศีกุมภ์', 
            dates: 'Jan 20 - Feb 18',
            image: '../assets/images/zodiac-11.png',
            isCenter: false
        },
        { 
            id: 12, 
            name: 'Pisces', 
            thaiName: 'ราศีมีน', 
            dates: 'Feb 19 - Mar 20',
            image: '../assets/images/zodiac-12.png',
            isCenter: false
        }
    ];

    // Create Grid HTML
    const gridHTML = zodiacData.map((zodiac, index) => {
        const cardClass = zodiac.isCenter ? 'zodiac-card zodiac-card-center' : 'zodiac-card';
        const animationDelay = index * 0.08; // Stagger animation
        const zIndex = 12 - index; // Cards later in the array appear on top
        
        return `
            <div class="${cardClass}" 
                 data-zodiac-id="${zodiac.id}"
                 style="animation-delay: ${animationDelay}s; z-index: ${zIndex};">
                <div class="zodiac-card-inner">
                    <div class="zodiac-card-image-wrapper">
                        <img src="${zodiac.image}" alt="${zodiac.name}" class="zodiac-card-img">
                    </div>
                    <div class="zodiac-card-info">
                        <h3 class="zodiac-card-name">${zodiac.name}</h3>
                        <p class="zodiac-card-thai">${zodiac.thaiName}</p>
                        <p class="zodiac-card-dates">${zodiac.dates}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Wrap in grid wrapper
    zodiacGridContainer.innerHTML = `<div class="zodiac-grid-wrapper">${gridHTML}</div>`;

    // Add scroll animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('zodiac-visible');
            }
        });
    }, observerOptions);

    // Observe all zodiac cards
    const allCards = document.querySelectorAll('.zodiac-card');
    allCards.forEach(card => {
        observer.observe(card);
    });

    // Add hover effects (simplified without z-index manipulation)
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

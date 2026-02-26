// Zodiac Cards Component
// 12 Zodiac Cards with transparent glass-morphism design
// Horizontal scroll with popup hover effect

document.addEventListener('DOMContentLoaded', function() {
    const zodiacCardsScroll = document.getElementById('zodiac-cards-scroll');
    
    if (!zodiacCardsScroll) return;

    // 12 Zodiac Signs Data
    const zodiacData = [
        { 
            id: 1, 
            name: 'Aries', 
            thaiName: 'ราศีเมษ', 
            dates: 'Mar 21 - Apr 19',
            symbol: '♈',
            image: '../assets/images/Aries.png'
        },
        { 
            id: 2, 
            name: 'Taurus', 
            thaiName: 'ราศีพฤษภ', 
            dates: 'Apr 20 - May 20',
            symbol: '♉',
            image: '../assets/images/Taurus.png'
        },
        { 
            id: 3, 
            name: 'Gemini', 
            thaiName: 'ราศีเมถุน', 
            dates: 'May 21 - Jun 20',
            symbol: '♊',
            image: '../assets/images/Gemini.png'
        },
        { 
            id: 4, 
            name: 'Cancer', 
            thaiName: 'ราศีกรกฎ', 
            dates: 'Jun 21 - Jul 22',
            symbol: '♋',
            image: '../assets/images/Cancer.png'
        },
        { 
            id: 5, 
            name: 'Leo', 
            thaiName: 'ราศีสิงห์', 
            dates: 'Jul 23 - Aug 22',
            symbol: '♌',
            image: '../assets/images/Leo.png'
        },
        { 
            id: 6, 
            name: 'Virgo', 
            thaiName: 'ราศีกันย์', 
            dates: 'Aug 23 - Sep 22',
            symbol: '♍',
            image: '../assets/images/Vigro.png'
        },
        { 
            id: 7, 
            name: 'Libra', 
            thaiName: 'ราศีตุลย์', 
            dates: 'Sep 23 - Oct 22',
            symbol: '♎',
            image: '../assets/images/Libra.png'
        },
        { 
            id: 8, 
            name: 'Scorpio', 
            thaiName: 'ราศีพิจิก', 
            dates: 'Oct 23 - Nov 21',
            symbol: '♏',
            image: '../assets/images/Scorpio.png'
        },
        { 
            id: 9, 
            name: 'Sagittarius', 
            thaiName: 'ราศีธนู', 
            dates: 'Nov 22 - Dec 21',
            symbol: '♐',
            image: '../assets/images/Sagittarius.png'
        },
        { 
            id: 10, 
            name: 'Capricorn', 
            thaiName: 'ราศีมกร', 
            dates: 'Dec 22 - Jan 19',
            symbol: '♑',
            image: '../assets/images/Capricorn.png'
        },
        { 
            id: 11, 
            name: 'Aquarius', 
            thaiName: 'ราศีกุมภ์', 
            dates: 'Jan 20 - Feb 18',
            symbol: '♒',
            image: '../assets/images/Aquarius.png'
        },
        { 
            id: 12, 
            name: 'Pisces', 
            thaiName: 'ราศีมีน', 
            dates: 'Feb 19 - Mar 20',
            symbol: '♓',
            image: '../assets/images/Pisces.png'
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

    // Insert cards into horizontal scroll container
    zodiacCardsScroll.innerHTML = cardsHTML;

    // Add click handlers for cards
    const allCards = document.querySelectorAll('.zodiac-card-item');
    allCards.forEach(card => {
        card.addEventListener('click', function() {
            const zodiacId = this.getAttribute('data-zodiac-id');
            const zodiac = zodiacData.find(z => z.id === parseInt(zodiacId));
            console.log('Clicked zodiac:', zodiac.name);
            // You can add navigation or modal functionality here
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all cards
    allCards.forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
});

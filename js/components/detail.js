// Detail Section Component
(function() {
    const detailHTML = `
        <section id="detail" class="detail-section">
            <!-- Main Content Container -->
            <div class="detail-container">
                
                <!-- Left Side: iPhone Mockup & Logo -->
                <div class="detail-left">
                    <!-- Luckkana Logo -->
                    <div class="detail-logo">
                        <img src="https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/luckkana-logo.png" alt="Luckkana Star">
                    </div>
                    
                    <!-- iPhone Mockup -->
                    <div class="detail-phone">
                        <img src="https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/Phoneig.png" alt="iPhone Mockup">
                    </div>
                </div>
                
                <!-- Right Side: Text Content -->
                <div class="detail-right">
                    
                    <!-- Top Text Block -->
                    <div class="detail-text-top">
                        <p class="detail-intro">
                            This question sparked the creation of 
                            <span class="highlight-semibold">LUCKKANA</span>, 
                            a Thesis Project dedicated to decoding that mystery.
                        </p>
                        
                        <div class="detail-description">
                            <p>
                                Why we created this : We believe that 
                                <span class="highlight-medium">Self-discovery through the stars</span> 
                                is not just superstition, but a study of cosmic statistics.
                            </p>
                            <p>&nbsp;</p>
                            <p>
                                <span class="highlight-medium">Our goal</span> 
                                was to bridge the gap between traditional fortune-telling and modern accessibility.
                            </p>
                        </div>
                    </div>
                    
                    <!-- Middle Section with Badge and Divider -->
                    <div class="detail-middle">
                        <div class="detail-badge">
                            <span>Project (Thesis) <em>ABOUT US</em></span>
                        </div>
                        
                        <div class="detail-divider">
                            <img src="https://res.cloudinary.com/dpezsckqq/image/upload/luckkana/line-divider.svg" alt="">
                        </div>
                    </div>
                    
                    <!-- Bottom Text Block (White Background) -->
                    <div class="detail-text-bottom">
                        <p>
                            We built this AI Chatbot not just to predict the future, but to calculate the 
                            '<span class="highlight-medium-black">Ascendant</span>' 
                            (Rising Sign) with mathematical precision, moving beyond generic horoscopes.
                        </p>
                        
                        <p>
                            Our mission is to create a 
                            <span class="highlight-medium-black">'Digital Companion'</span> 
                            that offers guidance based on the rigorous astrological data we have researched 
                            and compiled throughout this academic year.
                        </p>
                    </div>
                    
                </div>
            </div>
        </section>
    `;

    const detailStyles = `
        <style>
            /* Detail Section Styles */
            .detail-section {
                position: relative;
                width: 100%;
                min-height: 100vh;
                background-color: #000000;
                padding: 120px 40px;
                overflow: hidden;
            }
            
            /* Background white rectangle */
            .detail-bg-rectangle {
                position: absolute;
                width: 684px;
                height: 262px;
                background-color: #ffffff;
                border-radius: 22px;
                top: 658px;
                left: 687px;
            }
            
            /* Main Container */
            .detail-container {
                position: relative;
                max-width: 1440px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 60px;
            }
            
            /* Left Side */
            .detail-left {
                position: relative;
                flex: 0 0 584px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .detail-logo {
                position: absolute;
                top: 520px;
                left: -142px;
                width: 1044px;
                height: 355px;
                z-index: 2;
            }
            
            .detail-logo img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .detail-phone {
                position: relative;
                width: 584px;
                height: 876px;
                margin-top: 184px;
                z-index: 1;
            }
            
            .detail-phone img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            /* Right Side */
            .detail-right {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 44px;
                padding-top: 36px;
            }
            
            /* Top Text */
            .detail-text-top {
                display: flex;
                flex-direction: column;
                gap: 10px;
                color: #ffffff;
                font-family: 'General Sans', sans-serif;
                font-size: 24px;
                line-height: 1.4;
            }
            
            .detail-intro {
                width: 406px;
                margin: 0;
            }
            
            .detail-description {
                width: 100%;
                max-width: 604px;
            }
            
            .detail-description p {
                margin: 0;
            }
            
            .highlight-semibold {
                font-weight: 600;
            }
            
            .highlight-medium {
                font-weight: 500;
            }
            
            .highlight-medium-black {
                font-weight: 500;
                color: #000000;
            }
            
            /* Social Links */
            .detail-social {
                display: flex;
                flex-direction: column;
                gap: 15px;
                align-items: flex-start;
            }
            
            .social-link {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 5px 21px;
                background-color: #ffffff;
                border-radius: 41px;
                text-decoration: none;
                color: #000000;
                font-family: 'General Sans', sans-serif;
                font-weight: 500;
                font-size: 24px;
                transition: transform 0.3s ease;
            }
            
            .social-link:hover {
                transform: scale(1.05);
            }
            
            .social-icon {
                width: 32px;
                height: 32px;
                object-fit: cover;
            }
            
            .social-line {
                width: 282px;
                height: 47px;
            }
            
            .social-instagram {
                width: auto;
            }
            
            /* Middle Section */
            .detail-middle {
                display: flex;
                flex-direction: column;
                gap: 44px;
                align-items: flex-end;
                width: 713px;
            }
            
            .detail-badge {
                border: 1px solid #ffffff;
                border-radius: 41px;
                padding: 9px 10px 10px 10px;
                color: #ffffff;
                font-family: 'General Sans', sans-serif;
                font-size: 24px;
                text-align: center;
                width: 317px;
                height: 52px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .detail-badge em {
                font-style: italic;
                font-weight: 700;
            }
            
            .detail-divider {
                width: 389px;
                height: 1px;
            }
            
            .detail-divider img {
                width: 100%;
                height: auto;
            }
            
            .detail-website {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 5px 21px;
                background-color: #ffffff;
                border-radius: 41px;
                font-family: 'General Sans', sans-serif;
                font-weight: 500;
                font-size: 24px;
                color: #000000;
            }
            
            /* Bottom Text (White Background) */
            .detail-text-bottom {
                position: relative;
                z-index: 10;
                background-color: #ffffff;
                color: #000000;
                font-family: 'General Sans', sans-serif;
                font-size: 24px;
                line-height: 1.4;
                padding: 20px;
                border-radius: 22px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                width: 100%;
                max-width: 713px;
            }
            
            .detail-text-bottom p {
                margin: 0;
            }
            
            /* Responsive */
            @media (max-width: 1200px) {
                .detail-container {
                    flex-direction: column;
                    align-items: center;
                }
                
                .detail-left {
                    flex: 0 0 auto;
                }
                
                .detail-right {
                    width: 100%;
                    max-width: 713px;
                }
                
                .detail-bg-rectangle {
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
            
            @media (max-width: 768px) {
                .detail-section {
                    padding: 80px 20px;
                }
                
                .detail-phone {
                    width: 400px;
                    height: auto;
                }
                
                .detail-logo {
                    width: 700px;
                    left: -100px;
                }
                
                .detail-text-top,
                .detail-text-bottom {
                    font-size: 18px;
                }
                
                .detail-intro {
                    width: 100%;
                }
                
                .social-link {
                    font-size: 18px;
                }
                
                .detail-middle {
                    width: 100%;
                }
                
                .detail-badge {
                    width: 100%;
                    font-size: 18px;
                }
            }
        </style>
    `;

    // Initialize the component
    function init() {
        const detailContainer = document.getElementById('detail-section');
        if (detailContainer) {
            // Add styles to head
            document.head.insertAdjacentHTML('beforeend', detailStyles);
            
            // Add HTML to container
            detailContainer.innerHTML = detailHTML;
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for manual initialization if needed
    window.DetailComponent = { init };
})();

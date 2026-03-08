// Navbar Component
(function() {
    const navbarHTML = `
        <div class="navbar-container">
            <div class="navbar-content">
                <!-- Hamburger Menu Button -->
                <button class="hamburger-menu" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <!-- Navigation Menu -->
                <nav class="nav-menu-wrapper">
                    <!-- Left Menu -->
                    <div class="nav-menu nav-left">
                        <a href="index.html" class="nav-link" data-page="index">
                            Home
                        </a>
                        <a href="blog.html" class="nav-link" data-page="blog">
                            Get a Reading
                        </a>
                    </div>
                    
                    <!-- Right Menu -->
                    <div class="nav-menu nav-right">
                        <a href="chatbot.html" class="nav-link" data-page="chatbot">
                            The Oracle
                        </a>
                        <a href="#articles" class="nav-link" data-page="articles">
                            Articles
                        </a>
                    </div>
                </nav>
            </div>
        </div>
    `;

    const navbarStyles = `
        <style>
            .navbar-container {
                position: fixed;
                top: 18px;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                z-index: 10000; /* เพิ่มจาก 1000 เป็น 10000 เพื่อให้สูงกว่า loading screen */
                width: 800px;
                max-width: 90%;
                opacity: 0;
                animation: navbarSlideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                animation-delay: 0.3s;
                pointer-events: auto; /* ให้คลิกได้แน่นอน */
            }

            @keyframes navbarSlideDown {
                to {
                    transform: translateX(-50%) translateY(0);
                    opacity: 1;
                }
            }

            .navbar-content {
                background-color: rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                border-radius: 41px;
                padding: 8px 58px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 30px;
                height: 60px;
                position: relative;
            }

            .navbar-content::before {
                content: '';
                position: absolute;
                top: 8px;
                left: var(--indicator-left, 0);
                width: var(--indicator-width, 0);
                height: calc(100% - 16px);
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 25px;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
                opacity: 0;
            }

            .navbar-content.has-active::before {
                opacity: 1;
            }

            /* Hamburger Menu */
            .hamburger-menu {
                display: none;
                flex-direction: column;
                justify-content: space-around;
                width: 30px;
                height: 25px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                z-index: 10;
            }

            .hamburger-menu span {
                width: 100%;
                height: 3px;
                background-color: white;
                border-radius: 10px;
                transition: all 0.3s ease;
            }

            .hamburger-menu.active span:nth-child(1) {
                transform: rotate(45deg) translate(8px, 8px);
            }

            .hamburger-menu.active span:nth-child(2) {
                opacity: 0;
            }

            .hamburger-menu.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -7px);
            }

            /* Navigation Menu Wrapper */
            .nav-menu-wrapper {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                gap: 30px;
            }

            .nav-menu {
                display: flex;
                gap: 52px;
                align-items: center;
            }

            .nav-link {
                color: white;
                text-decoration: none;
                font-family: 'General Sans', sans-serif;
                font-size: 24px;
                font-weight: 400;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
                position: relative;
                padding: 8px 20px;
                border-radius: 25px;
                z-index: 1;
            }

            .nav-link.active {
                font-weight: 600;
            }

            .nav-link:hover {
                background: transparent;
            }

            .nav-link i {
                font-size: 18px;
            }

            .nav-logo {
                font-size: 32px;
                color: white;
                animation: navLogoRotate 10s linear infinite;
            }

            @keyframes navLogoRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Tablet - Large Mobile */
            @media (max-width: 768px) {
                .navbar-container {
                    width: 95%;
                    max-width: 95%;
                }

                .navbar-content {
                    padding: 8px 30px;
                    gap: 15px;
                    height: 55px;
                }

                .nav-menu-wrapper {
                    gap: 15px;
                }

                .nav-menu {
                    gap: 30px;
                }

                .nav-link {
                    font-size: 18px;
                    padding: 8px 15px;
                }

                .nav-link i {
                    font-size: 16px;
                }

                .nav-logo {
                    font-size: 26px;
                }
            }

            /* Small Mobile */
            @media (max-width: 640px) {
                .navbar-container {
                    top: 10px;
                }

                .navbar-content {
                    padding: 10px 20px;
                    height: auto;
                    min-height: 50px;
                    border-radius: 30px;
                }

                .hamburger-menu {
                    display: flex;
                }

                .nav-menu-wrapper {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    margin-top: 10px;
                    background-color: rgba(0, 0, 0, 0.3);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 20px;
                    flex-direction: column;
                    gap: 0;
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .nav-menu-wrapper.active {
                    max-height: 500px;
                    opacity: 1;
                }

                .nav-menu {
                    flex-direction: column;
                    gap: 10px;
                    width: 100%;
                }

                .nav-link {
                    font-size: 18px;
                    padding: 12px 20px;
                    width: 100%;
                    justify-content: center;
                    text-align: center;
                }

                .navbar-content::before {
                    display: none;
                }
            }

            /* Extra Small Mobile */
            @media (max-width: 480px) {
                .navbar-container {
                    top: 8px;
                    max-width: 96%;
                }

                .navbar-content {
                    padding: 8px 15px;
                    border-radius: 25px;
                }

                .nav-link {
                    font-size: 16px;
                    padding: 10px 15px;
                }

                .hamburger-menu {
                    width: 26px;
                    height: 22px;
                }

                .hamburger-menu span {
                    height: 2.5px;
                }
            }

            /* Very Small Devices */
            @media (max-width: 360px) {
                .navbar-content {
                    padding: 8px 12px;
                }

                .nav-link {
                    font-size: 15px;
                    padding: 10px 12px;
                }

                .nav-menu-wrapper {
                    padding: 15px;
                }
            }
        </style>
    `;

    // Insert navbar into page
    document.addEventListener('DOMContentLoaded', function() {
        const navbarElement = document.getElementById('navbar') || document.getElementById('navbar-placeholder');
        if (navbarElement) {
            navbarElement.innerHTML = navbarStyles + navbarHTML;
            
            // Auto-detect current page and set active state
            const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
            const navLinks = document.querySelectorAll('.nav-link');
            
            // Map related pages to their main nav items
            const pageMapping = {
                'index': 'index',
                'blog': 'blog',
                'simsy': 'blog',
                'simsy-result': 'blog',
                'chatbot': 'chatbot',
                '12zodiac': 'index',
                'colors': 'index'
            };
            
            const mappedPage = pageMapping[currentPath] || currentPath;
            
            navLinks.forEach(link => {
                const linkPage = link.getAttribute('data-page');
                if (linkPage === mappedPage) {
                    link.classList.add('active');
                }
            });
            
            // Hamburger menu functionality
            const hamburger = document.querySelector('.hamburger-menu');
            const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
            
            if (hamburger) {
                hamburger.addEventListener('click', function() {
                    this.classList.toggle('active');
                    navMenuWrapper.classList.toggle('active');
                });
                
                // Close menu when clicking a link
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        if (window.innerWidth <= 640) {
                            hamburger.classList.remove('active');
                            navMenuWrapper.classList.remove('active');
                        }
                    });
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', function(e) {
                    if (window.innerWidth <= 640) {
                        const navbar = document.querySelector('.navbar-container');
                        if (!navbar.contains(e.target)) {
                            hamburger.classList.remove('active');
                            navMenuWrapper.classList.remove('active');
                        }
                    }
                });
            }
            
            // Initialize indicator animation
            setTimeout(() => {
                const navLinks = document.querySelectorAll('.nav-link');
                const navbar = document.querySelector('.navbar-content');
                
                function updateIndicator(link) {
                    // Only show indicator on desktop
                    if (window.innerWidth > 640) {
                        const linkRect = link.getBoundingClientRect();
                        const navbarRect = navbar.getBoundingClientRect();
                        const left = linkRect.left - navbarRect.left;
                        const width = linkRect.width;
                        
                        navbar.style.setProperty('--indicator-left', left + 'px');
                        navbar.style.setProperty('--indicator-width', width + 'px');
                        navbar.classList.add('has-active');
                    }
                }
                
                navLinks.forEach(link => {
                    // Click event
                    link.addEventListener('click', function(e) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        updateIndicator(this);
                    });
                    
                    // Mouse enter event
                    link.addEventListener('mouseenter', function() {
                        if (window.innerWidth > 640) {
                            updateIndicator(this);
                        }
                    });
                    
                    // Initialize active link indicator
                    if (link.classList.contains('active')) {
                        updateIndicator(link);
                    }
                });
                
                // Mouse leave - return to active link
                navbar.addEventListener('mouseleave', function() {
                    if (window.innerWidth > 640) {
                        const activeLink = document.querySelector('.nav-link.active');
                        if (activeLink) {
                            updateIndicator(activeLink);
                        }
                    }
                });
                
                // Update indicator on resize
                window.addEventListener('resize', function() {
                    if (window.innerWidth > 640) {
                        const activeLink = document.querySelector('.nav-link.active');
                        if (activeLink) {
                            updateIndicator(activeLink);
                        }
                    }
                });
            }, 100);
        }
    });
})();

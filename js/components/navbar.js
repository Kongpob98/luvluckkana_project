// Navbar Component
(function() {
    const navbarHTML = `
        <div class="navbar-container">
            <div class="navbar-content">
                <!-- Left Menu -->
                <div class="nav-menu nav-left">
                    <a href="index.html" class="nav-link active">
                        Home
                    </a>
                    <a href="blog.html" class="nav-link">
                        Get a Reading
                    </a>
                </div>
                
                <!-- Right Menu -->
                <div class="nav-menu nav-right">
                    <a href="chatbot.html" class="nav-link">
                        The Oracle
                    </a>
                    <a href="#articles" class="nav-link">
                        Articles
                    </a>
                </div>
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
                z-index: 1000;
                width: 800px;
                max-width: 90%;
                opacity: 0;
                animation: navbarSlideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                animation-delay: 0.3s;
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

            .nav-link.active {
                font-weight: 600;
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

            @media (max-width: 768px) {
                .navbar-container {
                    width: 95%;
                }

                .navbar-content {
                    padding: 8px 20px;
                    gap: 10px;
                }

                .nav-menu {
                    gap: 20px;
                }

                .nav-link {
                    font-size: 16px;
                }

                .nav-link i {
                    display: none;
                }

                .nav-logo {
                    font-size: 24px;
                }
            }
        </style>
    `;

    // Insert navbar into page
    document.addEventListener('DOMContentLoaded', function() {
        const navbarElement = document.getElementById('navbar') || document.getElementById('navbar-placeholder');
        if (navbarElement) {
            navbarElement.innerHTML = navbarStyles + navbarHTML;
            
            // Initialize indicator animation
            setTimeout(() => {
                const navLinks = document.querySelectorAll('.nav-link');
                const navbar = document.querySelector('.navbar-content');
                
                function updateIndicator(link) {
                    const linkRect = link.getBoundingClientRect();
                    const navbarRect = navbar.getBoundingClientRect();
                    const left = linkRect.left - navbarRect.left;
                    const width = linkRect.width;
                    
                    navbar.style.setProperty('--indicator-left', left + 'px');
                    navbar.style.setProperty('--indicator-width', width + 'px');
                    navbar.classList.add('has-active');
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
                        updateIndicator(this);
                    });
                    
                    // Initialize active link indicator
                    if (link.classList.contains('active')) {
                        updateIndicator(link);
                    }
                });
                
                // Mouse leave - return to active link
                navbar.addEventListener('mouseleave', function() {
                    const activeLink = document.querySelector('.nav-link.active');
                    if (activeLink) {
                        updateIndicator(activeLink);
                    }
                });
            }, 100);
        }
    });
})();

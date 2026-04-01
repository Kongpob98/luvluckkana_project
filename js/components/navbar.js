// Navbar Component
(function() {
    const AUDIO_STORAGE_KEY = 'luckkana-bg-audio-enabled';
    const AUDIO_TIME_KEY = 'luckkana-bg-audio-time';
    const AUDIO_SOURCES = [
        '../assets/audio/bgsound.mp3',
        '../assets/bgsound.mp3',
        '../bgsound.mp3',
        './bgsound.mp3',
        '/assets/audio/bgsound.mp3',
        '/assets/bgsound.mp3',
        '/bgsound.mp3'
    ];

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
                        <div class="nav-item nav-item-dropdown" data-dropdown="home-pages">
                            <div class="nav-item-dropdown-header">
                                <a href="index.html" class="nav-link" data-page="index">
                                    หน้าหลัก
                                </a>
                                <button class="nav-dropdown-toggle" type="button" aria-label="เปิดเมนูหน้าหลัก" aria-expanded="false" aria-controls="homePagesDropdown">
                                    <span class="nav-dropdown-caret" aria-hidden="true"></span>
                                </button>
                            </div>
                            <div class="nav-dropdown-menu" id="homePagesDropdown">
                                <a href="simsy.html" class="nav-dropdown-link">เซียมซี</a>
                                <a href="12zodiac.html" class="nav-dropdown-link">12 ราศี</a>
                                <a href="chinese-zodiac.html" class="nav-dropdown-link">12 นักษัตร</a>
                                <a href="birthday-fortune.html" class="nav-dropdown-link">ดูดวงวันเกิด</a>
                            </div>
                        </div>
                        <div class="nav-item nav-item-dropdown" data-dropdown="mystic-pages">
                            <div class="nav-item-dropdown-header">
                                <a href="blog.html" class="nav-link" data-page="blog">
                                    สายมู
                                </a>
                                <button class="nav-dropdown-toggle" type="button" aria-label="เปิดเมนูสายมู" aria-expanded="false" aria-controls="mysticPagesDropdown">
                                    <span class="nav-dropdown-caret" aria-hidden="true"></span>
                                </button>
                            </div>
                            <div class="nav-dropdown-menu" id="mysticPagesDropdown">
                                <a href="numerology.html" class="nav-dropdown-link">ศาสตร์ตัวเลข</a>
                                <a href="colors.html" class="nav-dropdown-link">สีประจำวัน</a>
                                <a href="fortune-boost.html" class="nav-dropdown-link">เสริมดวง</a>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Center Logo -->
                    <a href="index.html" class="nav-logo-center">
                        <img src="https://res.cloudinary.com/dpezsckqq/image/upload/f_auto,q_auto/f_auto,q_auto/luckkana/hero-logo.png" alt="Luckkana Star Logo" class="nav-logo-image">
                    </a>
                    
                    <!-- Right Menu -->
                    <div class="nav-menu nav-right">
                        <a href="chatbot.html" class="nav-link" data-page="chatbot">
                            แม่หมอ
                        </a>
                        <a href="about.html" class="nav-link" data-page="about">
                            ผู้สร้าง
                        </a>
                    </div>
                </nav>

                <button class="sound-toggle" type="button" aria-label="ปิดเสียงพื้นหลัง" aria-pressed="true" title="ปิดเสียงพื้นหลัง">
                    <span class="sound-toggle-icon" aria-hidden="true">
                        <svg class="icon-sound-on" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M4 10v4h4l5 4V6l-5 4H4z" fill="currentColor" stroke="none"></path>
                            <path d="M16 9.5a4 4 0 0 1 0 5"></path>
                            <path d="M18.5 7a7.5 7.5 0 0 1 0 10"></path>
                        </svg>
                        <svg class="icon-sound-off" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                            <path d="M4 10v4h4l5 4V6l-5 4H4z" fill="currentColor" stroke="none"></path>
                            <path d="M16 10l5 5"></path>
                            <path d="M21 10l-5 5"></path>
                        </svg>
                    </span>
                    <span class="sound-toggle-label sr-only">ปิดเสียงพื้นหลัง</span>
                </button>
            </div>
        </div>
    `;

    const navbarStyles = `
        <style>
            :root {
                --luckkana-navbar-top: 18px;
                --luckkana-navbar-height: 60px;
            }

            .navbar-container {
                position: fixed;
                top: var(--luckkana-navbar-top);
                left: 0;
                right: 0;
                margin: 0 auto;
                transform: translateY(-100px);
                z-index: 10000; /* เพิ่มจาก 1000 เป็น 10000 เพื่อให้สูงกว่า loading screen */
                width: 800px;
                max-width: 90%;
                opacity: 0;
                animation: navbarSlideDown 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                pointer-events: auto; /* ให้คลิกได้แน่นอน */
            }

            @keyframes navbarSlideDown {
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            .navbar-content {
                background:
                    linear-gradient(145deg,
                        rgba(255, 255, 255, 0.2) 0%,
                        rgba(255, 255, 255, 0.1) 36%,
                        rgba(255, 255, 255, 0.04) 100%),
                    rgba(14, 18, 30, 0.66);
                backdrop-filter: blur(18px) saturate(145%);
                -webkit-backdrop-filter: blur(18px) saturate(145%);
                border: 1px solid rgba(255, 255, 255, 0.36);
                box-shadow:
                    0 12px 24px rgba(0, 0, 0, 0.34),
                    inset 0 1px 0 rgba(255, 255, 255, 0.28);
                border-radius: 41px;
                padding: 8px 58px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 30px;
                height: var(--luckkana-navbar-height);
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
                z-index: 1;
            }

            .navbar-content > * {
                position: relative;
                z-index: 2;
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
                justify-content: center;
                flex: 1;
                min-width: 0;
                gap: 30px;
            }

            .nav-logo-center {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                flex-shrink: 0;
                transition: opacity 0.3s ease;
            }

            .nav-logo-image {
                height: 46px;
                width: auto;
                display: block;
            }

            .nav-logo-center:hover {
                opacity: 0.85;
            }

            .nav-menu {
                display: flex;
                gap: 52px;
                align-items: center;
            }

            .nav-item {
                position: relative;
            }

            .nav-item-dropdown {
                display: flex;
                align-items: center;
            }

            .nav-item-dropdown::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                width: 210px;
                height: 10px;
            }

            .nav-item-dropdown-header {
                display: flex;
                align-items: center;
                position: relative;
            }

            .nav-dropdown-toggle {
                display: none;
                align-items: center;
                justify-content: center;
                width: 34px;
                height: 34px;
                border: none;
                border-radius: 12px;
                background: transparent;
                color: white;
                cursor: pointer;
                flex-shrink: 0;
                z-index: 5;
                pointer-events: auto;
                transition: background 0.25s ease, transform 0.25s ease;
            }

            .nav-dropdown-toggle:hover,
            .nav-dropdown-toggle:focus-visible {
                background: transparent;
            }

            .nav-dropdown-caret {
                width: 9px;
                height: 9px;
                border-right: 2px solid currentColor;
                border-bottom: 2px solid currentColor;
                transform: rotate(45deg) translateY(-1px);
                transition: transform 0.25s ease;
            }

            .nav-item-dropdown.open .nav-dropdown-caret {
                transform: rotate(-135deg) translate(-1px, -1px);
            }

            .nav-dropdown-menu {
                position: absolute;
                top: calc(100% + 8px);
                left: 50%;
                min-width: 210px;
                padding: 10px;
                border-radius: 16px;
                background:
                    linear-gradient(145deg,
                        rgba(255, 255, 255, 0.2) 0%,
                        rgba(255, 255, 255, 0.1) 36%,
                        rgba(255, 255, 255, 0.04) 100%),
                    rgba(16, 20, 34, 0.72);
                border: 1px solid rgba(255, 255, 255, 0.34);
                backdrop-filter: blur(18px) saturate(150%);
                -webkit-backdrop-filter: blur(18px) saturate(150%);
                box-shadow: 0 14px 28px rgba(0, 0, 0, 0.32);
                display: flex;
                flex-direction: column;
                gap: 4px;
                opacity: 0;
                transform: translate(-50%, 8px);
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease;
                z-index: 60;
            }

            .nav-dropdown-link {
                color: white;
                text-decoration: none;
                font-family: 'DB Heavent Cond', sans-serif;
                font-size: 22px;
                line-height: 1.1;
                display: block;
                padding: 10px 14px;
                border-radius: 10px;
                transition: background 0.25s ease;
                white-space: nowrap;
                text-align: center;
            }

            .nav-dropdown-link:hover,
            .nav-dropdown-link:focus-visible {
                background: rgba(255, 255, 255, 0.14);
            }

            .nav-item-dropdown:hover .nav-dropdown-menu,
            .nav-item-dropdown:focus-within .nav-dropdown-menu {
                opacity: 1;
                transform: translate(-50%, 0);
                pointer-events: auto;
            }

            .nav-item-dropdown.open .nav-dropdown-menu {
                opacity: 1;
                transform: translate(-50%, 0);
                pointer-events: auto;
            }

            .nav-link {
                color: white;
                text-decoration: none;
                font-family: 'DB Heavent Cond', sans-serif;
                font-size: 25px;
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
                font-weight: 700;
            }

            .nav-link:hover {
                background: transparent;
                font-weight: 700;
            }

            .nav-link:focus-visible {
                font-weight: 700;
            }

            .nav-link i {
                font-size: 18px;
            }

            .nav-logo {
                font-size: 32px;
                color: white;
                animation: navLogoRotate 10s linear infinite;
            }

            .sound-toggle {
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 999px;
                color: white;
                cursor: pointer;
                width: 44px;
                height: 44px;
                padding: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                transition: background 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
            }

            .sound-toggle-icon {
                width: 21px;
                height: 21px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .sound-toggle-icon svg {
                width: 100%;
                height: 100%;
                stroke: currentColor;
                stroke-width: 1.8;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: none;
            }

            .sound-toggle .icon-sound-off {
                display: none;
            }

            .sound-toggle[data-enabled="false"] .icon-sound-on {
                display: none;
            }

            .sound-toggle[data-enabled="false"] .icon-sound-off {
                display: block;
            }

            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }

            @media (max-width: 1024px) {
                .navbar-content::before {
                    display: none;
                }

                .nav-item-dropdown-header {
                    padding-right: 44px;
                    box-sizing: border-box;
                }

                .nav-item-dropdown::after {
                    display: none;
                }

                .nav-item-dropdown:hover .nav-dropdown-menu,
                .nav-item-dropdown:focus-within .nav-dropdown-menu {
                    opacity: 0;
                    transform: translate(-50%, 8px);
                    pointer-events: none;
                }

                .nav-item-dropdown.open .nav-dropdown-menu {
                    opacity: 1;
                    transform: translate(-50%, 0);
                    pointer-events: auto;
                }

                .nav-dropdown-toggle {
                    display: inline-flex;
                    position: absolute;
                    right: 8px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .nav-link.active {
                    background: rgba(255, 255, 255, 0.18);
                    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
                }

                .sound-toggle {
                    width: 42px;
                    height: 42px;
                }
            }

            .sound-toggle:hover {
                background: rgba(255, 255, 255, 0.18);
                border-color: rgba(255, 255, 255, 0.35);
            }

            .sound-toggle[data-enabled="false"] {
                opacity: 0.65;
            }

            .sound-toggle:disabled {
                cursor: not-allowed;
                opacity: 0.45;
            }

            @keyframes navLogoRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Tablet - Large Mobile */
            @media (max-width: 768px) {
                :root {
                    --luckkana-navbar-height: 55px;
                }

                .navbar-container {
                    width: 95%;
                    max-width: 95%;
                }

                .navbar-content {
                    padding: 8px 30px;
                    gap: 15px;
                    height: 55px;
                    background:
                        linear-gradient(145deg,
                            rgba(255, 255, 255, 0.20) 0%,
                            rgba(255, 255, 255, 0.08) 38%,
                            rgba(255, 255, 255, 0.02) 100%),
                        rgba(10, 12, 20, 0.84);
                    backdrop-filter: blur(26px) saturate(185%) contrast(112%);
                    -webkit-backdrop-filter: blur(26px) saturate(185%) contrast(112%);
                    border: 1px solid rgba(255, 255, 255, 0.42);
                    box-shadow:
                        0 14px 30px rgba(0, 0, 0, 0.48),
                        inset 0 1px 0 rgba(255, 255, 255, 0.34),
                        inset 0 -14px 28px rgba(18, 24, 42, 0.22);
                    overflow: hidden;
                }

                .navbar-content::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background:
                        radial-gradient(120% 90% at 10% 0%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 52%),
                        radial-gradient(100% 70% at 85% 120%, rgba(120, 170, 255, 0.14) 0%, rgba(120, 170, 255, 0) 60%);
                    pointer-events: none;
                    z-index: 0;
                }

                .nav-menu-wrapper {
                    gap: 15px;
                }

                .nav-menu {
                    gap: 30px;
                }

                .nav-dropdown-menu {
                    min-width: 190px;
                }

                .nav-dropdown-link {
                    font-size: 20px;
                    padding: 9px 12px;
                }

                .nav-logo-image {
                    height: 37px;
                }

                .nav-link {
                    font-size: 19px;
                    padding: 8px 15px;
                }

                .nav-link i {
                    font-size: 16px;
                }

                .nav-logo {
                    font-size: 26px;
                }

                .sound-toggle {
                    width: 40px;
                    height: 40px;
                }
            }

            /* Small Mobile + iPad Portrait */
            @media (max-width: 768px), (max-width: 1024px) and (orientation: portrait) {
                :root {
                    --luckkana-navbar-top: 10px;
                }

                .navbar-container {
                    top: 10px;
                }

                .navbar-content {
                    padding: 10px 20px;
                    height: auto;
                    min-height: 50px;
                    border-radius: 30px;
                    background:
                        linear-gradient(145deg,
                            rgba(255, 255, 255, 0.20) 0%,
                            rgba(255, 255, 255, 0.08) 38%,
                            rgba(255, 255, 255, 0.02) 100%),
                        rgba(10, 12, 20, 0.88);
                    overflow: visible;
                }

                .hamburger-menu {
                    display: flex;
                }

                .sound-toggle {
                    width: 38px;
                    height: 38px;
                }

                .nav-menu-wrapper {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    margin-top: 10px;
                    background:
                        linear-gradient(145deg,
                            rgba(255, 255, 255, 0.18) 0%,
                            rgba(255, 255, 255, 0.08) 36%,
                            rgba(255, 255, 255, 0.03) 100%),
                        rgba(10, 12, 20, 0.90);
                    backdrop-filter: blur(24px) saturate(180%) contrast(110%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%) contrast(110%);
                    border: 1px solid rgba(255, 255, 255, 0.40);
                    box-shadow:
                        0 16px 32px rgba(0, 0, 0, 0.52),
                        inset 0 1px 0 rgba(255, 255, 255, 0.28);
                    border-radius: 20px;
                    padding: 20px;
                    flex-direction: column;
                    gap: 0;
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transition: all 0.3s ease;
                    z-index: 30;
                }

                .nav-menu-wrapper::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: radial-gradient(120% 90% at 10% 0%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 56%);
                    pointer-events: none;
                    z-index: 0;
                }

                .nav-menu-wrapper > * {
                    position: relative;
                    z-index: 1;
                }

                .nav-logo-center {
                    display: none;
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

                .nav-item-dropdown {
                    width: 100%;
                    flex-direction: column;
                    align-items: stretch;
                }

                .nav-item-dropdown::after {
                    display: none;
                }

                .nav-item-dropdown-header {
                    width: 100%;
                    display: block;
                    position: relative;
                    padding-right: 0;
                    box-sizing: border-box;
                }

                .nav-item-dropdown-header .nav-link {
                    width: 100%;
                    box-sizing: border-box;
                }

                .nav-dropdown-toggle {
                    right: 10px;
                    width: 40px;
                    height: 40px;
                }

                .nav-dropdown-menu {
                    position: static;
                    margin-top: 8px;
                    min-width: 100%;
                    border-radius: 14px;
                    padding: 0;
                    background:
                        linear-gradient(145deg,
                            rgba(255, 255, 255, 0.18) 0%,
                            rgba(255, 255, 255, 0.08) 36%,
                            rgba(255, 255, 255, 0.03) 100%),
                        rgba(10, 12, 20, 0.92);
                    backdrop-filter: blur(24px) saturate(180%) contrast(110%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%) contrast(110%);
                    border: 1px solid rgba(255, 255, 255, 0.40);
                    box-shadow:
                        0 16px 32px rgba(0, 0, 0, 0.52),
                        inset 0 1px 0 rgba(255, 255, 255, 0.28);
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                    transform: none;
                    pointer-events: none;
                    transition: max-height 0.28s ease, opacity 0.2s ease, padding 0.2s ease;
                }

                .nav-item-dropdown:hover .nav-dropdown-menu,
                .nav-item-dropdown:focus-within .nav-dropdown-menu {
                    opacity: 0;
                    transform: none;
                    pointer-events: none;
                }

                .nav-item-dropdown.open .nav-dropdown-menu {
                    max-height: 260px;
                    padding: 8px;
                    opacity: 1;
                    transform: none;
                    pointer-events: auto;
                }

                .nav-dropdown-link {
                    font-size: 20px;
                    padding: 12px 16px;
                    text-align: center;
                }

                .nav-link {
                    font-size: 23px;
                    padding: 14px 22px;
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
                    font-size: 20px;
                    padding: 12px 16px;
                }

                .sound-toggle {
                    width: 36px;
                    height: 36px;
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
                    font-size: 18px;
                    padding: 12px 14px;
                }

                .nav-menu-wrapper {
                    padding: 15px;
                }
            }
        </style>
    `;

    function initBackgroundAudio() {
        const soundToggle = document.querySelector('.sound-toggle');
        if (!soundToggle) return;

        const savedTime = parseFloat(sessionStorage.getItem(AUDIO_TIME_KEY) || '0');
        const resumeTime = Number.isFinite(savedTime) && savedTime > 0 ? savedTime : 0;

        let audio = document.getElementById('global-bg-audio');
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = 'global-bg-audio';
            audio.loop = true;
            audio.preload = 'auto';
            audio.volume = 0.28;
            audio.setAttribute('playsinline', '');
            audio.setAttribute('webkit-playsinline', 'true');

            AUDIO_SOURCES.forEach((src) => {
                const source = document.createElement('source');
                source.src = src;
                source.type = 'audio/mpeg';
                audio.appendChild(source);
            });

            audio.addEventListener('timeupdate', () => {
                sessionStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime));
            });

            document.body.appendChild(audio);
        }

        let isEnabled = localStorage.getItem(AUDIO_STORAGE_KEY) !== 'off';
        let isAudioAvailable = true;
        let hasRequestedLoad = false;
        let hasAppliedResumeTime = false;

        function removeInteractionListeners() {
            document.removeEventListener('pointerdown', handleFirstInteraction);
            document.removeEventListener('keydown', handleFirstInteraction);
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        }

        function persistAudioTime() {
            sessionStorage.setItem(AUDIO_TIME_KEY, String(audio.currentTime || 0));
        }

        function persistAndPauseAudio() {
            persistAudioTime();
            audio.pause();
        }

        function applyResumeTimeWhenReady() {
            if (hasAppliedResumeTime || resumeTime <= 0) {
                return;
            }

            const setCurrentTime = () => {
                const maxSeekTime = Number.isFinite(audio.duration) && audio.duration > 0
                    ? Math.max(0, audio.duration - 0.5)
                    : resumeTime;
                audio.currentTime = Math.min(resumeTime, maxSeekTime);
                hasAppliedResumeTime = true;
            };

            if (audio.readyState >= 1) {
                setCurrentTime();
                return;
            }

            requestAudioLoad();

            audio.addEventListener('loadedmetadata', setCurrentTime, { once: true });
        }

        function updateSoundToggle() {
            const soundToggleLabel = soundToggle.querySelector('.sound-toggle-label');

            if (!isAudioAvailable) {
                soundToggle.setAttribute('aria-label', 'เสียงพื้นหลังไม่พร้อมใช้งาน');
                soundToggle.setAttribute('title', 'เสียงพื้นหลังไม่พร้อมใช้งาน');
                soundToggle.setAttribute('aria-pressed', 'false');
                soundToggle.dataset.enabled = 'false';
                if (soundToggleLabel) {
                    soundToggleLabel.textContent = 'เสียงพื้นหลังไม่พร้อมใช้งาน';
                }
                soundToggle.disabled = true;
                return;
            }

            soundToggle.disabled = false;
            const toggleLabel = isEnabled ? 'ปิดเสียงพื้นหลัง' : 'เปิดเสียงพื้นหลัง';
            soundToggle.setAttribute('aria-label', toggleLabel);
            soundToggle.setAttribute('title', toggleLabel);
            soundToggle.setAttribute('aria-pressed', String(isEnabled));
            soundToggle.dataset.enabled = String(isEnabled);
            if (soundToggleLabel) {
                soundToggleLabel.textContent = toggleLabel;
            }
        }

        function requestAudioLoad() {
            if (hasRequestedLoad) return;
            hasRequestedLoad = true;
            audio.load();
        }

        function tryPlayAudio() {
            if (!isEnabled || !isAudioAvailable) return Promise.resolve(false);

            requestAudioLoad();
            applyResumeTimeWhenReady();

            return audio.play()
                .then(() => {
                    localStorage.setItem(AUDIO_STORAGE_KEY, 'on');
                    updateSoundToggle();
                    return true;
                })
                .catch(() => false);
        }

        function pauseAudio() {
            persistAudioTime();
            audio.pause();
            isEnabled = false;
            localStorage.setItem(AUDIO_STORAGE_KEY, 'off');
            updateSoundToggle();
        }

        function handleFirstInteraction() {
            tryPlayAudio().then((didPlay) => {
                if (didPlay) {
                    removeInteractionListeners();
                }
            });
        }

        function retryAudioWhenPageActive() {
            if (!isEnabled || !isAudioAvailable || !audio.paused) {
                return;
            }

            tryPlayAudio().then((didPlay) => {
                if (didPlay) {
                    removeInteractionListeners();
                }
            });
        }

        audio.addEventListener('error', () => {
            isAudioAvailable = false;
            updateSoundToggle();
        });

        audio.addEventListener('play', () => {
            updateSoundToggle();
        });

        audio.addEventListener('pause', () => {
            if (isEnabled) {
                updateSoundToggle();
            }
        });

        soundToggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!isAudioAvailable) return;

            if (isEnabled && !audio.paused) {
                pauseAudio();
                return;
            }

            isEnabled = true;
            localStorage.setItem(AUDIO_STORAGE_KEY, 'on');
            updateSoundToggle();
            tryPlayAudio();
        });

        window.addEventListener('beforeunload', persistAndPauseAudio);
        window.addEventListener('pagehide', persistAndPauseAudio);
        window.addEventListener('focus', retryAudioWhenPageActive);
        window.addEventListener('pageshow', retryAudioWhenPageActive);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                persistAndPauseAudio();
                return;
            }

            retryAudioWhenPageActive();
        });

        updateSoundToggle();
        document.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
        document.addEventListener('keydown', handleFirstInteraction);
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
        tryPlayAudio();
    }

    function initializeNavbar() {
        const navbarElement = document.getElementById('navbar') || document.getElementById('navbar-placeholder');
        if (!navbarElement || navbarElement.dataset.navbarReady === 'true') {
            return;
        }

        navbarElement.dataset.navbarReady = 'true';
        navbarElement.innerHTML = navbarStyles + navbarHTML;
        initBackgroundAudio();
        
        // Auto-detect current page and set active state
        const currentPath = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Map related pages to their main nav items
        const pageMapping = {
            'index': 'index',
            'blog': 'blog',
            'simsy': 'index',
            'simsy-result': 'index',
            'chatbot': 'chatbot',
            '12zodiac': 'index',
            'chinese-zodiac': 'index',
            'birthday-fortune': 'index',
            'numerology': 'blog',
            'colors': 'blog',
            'fortune-boost': 'blog',
            'about': 'about'
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
        const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
        const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');

        function closeAllDropdowns() {
            dropdownItems.forEach((item) => item.classList.remove('open'));
            dropdownToggles.forEach((toggle) => {
                toggle.setAttribute('aria-expanded', 'false');
            });
        }

        dropdownToggles.forEach((toggle) => {
            toggle.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                if (window.innerWidth > 1024) return;

                const parentDropdown = this.closest('.nav-item-dropdown');
                const willOpen = parentDropdown && !parentDropdown.classList.contains('open');

                closeAllDropdowns();

                if (willOpen && parentDropdown) {
                    parentDropdown.classList.add('open');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });
        
        if (hamburger) {
            function isCompactMenuMode() {
                return window.innerWidth <= 768 || window.matchMedia('(max-width: 1024px) and (orientation: portrait)').matches;
            }

            hamburger.addEventListener('click', function() {
                const isOpening = !navMenuWrapper.classList.contains('active');
                this.classList.toggle('active');
                navMenuWrapper.classList.toggle('active');

                if (!isOpening) {
                    closeAllDropdowns();
                }
            });
            
            // Close menu when clicking a link
            const navLinks = document.querySelectorAll('.nav-link, .nav-dropdown-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 1024) {
                        closeAllDropdowns();
                    }

                    if (isCompactMenuMode()) {
                        hamburger.classList.remove('active');
                        navMenuWrapper.classList.remove('active');
                    }
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024 && !e.target.closest('.nav-item-dropdown')) {
                    closeAllDropdowns();
                }

                if (isCompactMenuMode()) {
                    const navbar = document.querySelector('.navbar-container');
                    if (navbar && !navbar.contains(e.target)) {
                        hamburger.classList.remove('active');
                        navMenuWrapper.classList.remove('active');
                        closeAllDropdowns();
                    }
                }
            });

            window.addEventListener('resize', function() {
                if (window.innerWidth > 1024) {
                    closeAllDropdowns();
                }
            });
        }
        
        // Initialize indicator animation
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link');
            const navbar = document.querySelector('.navbar-content');
            if (!navbar) return;

            function isDesktopIndicatorEnabled() {
                return window.matchMedia('(min-width: 1025px)').matches;
            }

            function clearIndicator() {
                navbar.classList.remove('has-active');
                navbar.style.setProperty('--indicator-left', '0px');
                navbar.style.setProperty('--indicator-width', '0px');
            }
            
            function updateIndicator(link) {
                if (!link || !isDesktopIndicatorEnabled()) {
                    clearIndicator();
                    return;
                }

                const linkRect = link.getBoundingClientRect();
                const navbarRect = navbar.getBoundingClientRect();
                const left = linkRect.left - navbarRect.left;
                const width = linkRect.width;

                navbar.style.setProperty('--indicator-left', left + 'px');
                navbar.style.setProperty('--indicator-width', width + 'px');
                navbar.classList.add('has-active');
            }

            function refreshActiveIndicator() {
                const activeLink = document.querySelector('.nav-link.active');
                updateIndicator(activeLink);
            }
            
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    updateIndicator(this);
                });
                
                link.addEventListener('mouseenter', function() {
                    if (isDesktopIndicatorEnabled()) {
                        updateIndicator(this);
                    }
                });
                
                if (link.classList.contains('active')) {
                    updateIndicator(link);
                }
            });
            
            navbar.addEventListener('mouseleave', function() {
                if (isDesktopIndicatorEnabled()) {
                    refreshActiveIndicator();
                }
            });
            
            window.addEventListener('resize', function() {
                refreshActiveIndicator();
            });

            window.addEventListener('orientationchange', refreshActiveIndicator);
            window.addEventListener('load', refreshActiveIndicator);

            if (document.fonts && typeof document.fonts.ready?.then === 'function') {
                document.fonts.ready.then(refreshActiveIndicator).catch(() => {
                    refreshActiveIndicator();
                });
            }

            requestAnimationFrame(() => requestAnimationFrame(refreshActiveIndicator));
        }, 100);
    }

    if (document.getElementById('navbar') || document.getElementById('navbar-placeholder')) {
        initializeNavbar();
    } else {
        document.addEventListener('DOMContentLoaded', initializeNavbar, { once: true });
    }
})();

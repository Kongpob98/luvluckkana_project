/**
 * Loading Screen Component
 * Displays a loading animation while the page loads AND during page navigation
 */

class LoadingScreen {
    constructor(options = {}) {
        this.options = {
            videoSrc: options.videoSrc || '../assets/images/Logoload.mp4',
            minDisplayTime: options.minDisplayTime ?? 0, // Do not force extra wait; follow actual load timing
            navigationDisplayTime: options.navigationDisplayTime ?? 0, // Do not delay navigation artificially
            showProgress: options.showProgress !== false, // Show loading text
            autoHide: options.autoHide !== false, // Auto hide when page loads
            autoShow: options.autoShow !== undefined ? options.autoShow : true, // Show on page load by default
            interceptLinks: options.interceptLinks !== false, // Intercept internal links for smooth transition
            ...options
        };
        
        this.startTime = Date.now();
        this.isReady = false;
        this.isNavigating = false;
        this.progressValue = 0;
        this.progressTimer = null;
        
        this.init();
    }
    
    init() {
        // Create loading screen HTML (but don't show it initially)
        this.createLoadingHTML();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Intercept internal links for page transitions
        if (this.options.interceptLinks) {
            this.setupLinkInterception();
        }
        
        // Only show loading on initial page load if autoShow is enabled
        if (this.options.autoShow) {
            document.body.classList.add('loading-active');
        } else {
            // Hide loading screen initially and ensure it doesn't block clicks
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
                this.loadingScreen.style.pointerEvents = 'none';
            }
        }
        
        // Force hide loading after 10 seconds if still showing (safety net)
        setTimeout(() => {
            if (this.loadingScreen && !this.loadingScreen.classList.contains('hidden')) {
                console.log('Force hiding loading screen');
                this.hide();
            }
        }, 10000);
    }
    
    createLoadingHTML() {
        // Check if loading screen already exists (prevent duplicates)
        const existingLoadingScreen = document.getElementById('loadingScreen');
        if (existingLoadingScreen) {
            this.loadingScreen = existingLoadingScreen;
            this.loadingVideo = document.getElementById('loadingVideo');
            return;
        }
        
        const loadingHTML = `
            <div class="loading-screen" id="loadingScreen">
                <div class="loading-video-container">
                    <video 
                        id="loadingVideo" 
                        class="loading-video" 
                        autoplay 
                        muted 
                        loop 
                        playsinline
                        preload="metadata">
                        <source src="${this.options.videoSrc}" type="video/mp4">
                    </video>
                    ${this.options.showProgress ? `
                        <div class="loading-progress">
                            <div class="loading-progress-text">กำลังโหลด</div>
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Insert at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        
        this.loadingScreen = document.getElementById('loadingScreen');
        this.loadingVideo = document.getElementById('loadingVideo');
        this.progressText = document.querySelector('.loading-progress-text');
        this.progressFill = document.querySelector('.progress-fill');

        this.setProgress(8);
    }

    setProgress(value, label) {
        this.progressValue = Math.max(0, Math.min(100, value));

        if (this.progressFill) {
            this.progressFill.style.width = `${this.progressValue}%`;
        }

        if (this.progressText) {
            const nextLabel = label || (this.progressValue >= 100 ? 'พร้อมแล้ว' : `กำลังโหลด ${Math.round(this.progressValue)}%`);
            this.progressText.textContent = nextLabel;
        }
    }

    stopProgressSimulation() {
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
    }

    startProgressSimulation(mode = 'initial') {
        this.stopProgressSimulation();

        const cap = mode === 'navigation' ? 72 : 92;
        const intervalMs = mode === 'navigation' ? 90 : 140;

        this.progressTimer = setInterval(() => {
            if (this.progressValue >= cap) {
                this.stopProgressSimulation();
                return;
            }

            const remaining = cap - this.progressValue;
            const increment = Math.max(1.5, remaining * 0.12);
            this.setProgress(this.progressValue + increment);
        }, intervalMs);
    }

    completeProgress() {
        this.stopProgressSimulation();
        this.setProgress(100, 'พร้อมแล้ว');
    }
    
    setupEventListeners() {
        // Ensure video plays
        if (this.loadingVideo) {
            this.loadingVideo.play().catch(err => {
                console.log('Loading video autoplay prevented:', err);
            });
        }

        if (this.options.showProgress) {
            this.startProgressSimulation('initial');

            document.addEventListener('readystatechange', () => {
                if (document.readyState === 'interactive') {
                    this.setProgress(Math.max(this.progressValue, 58));
                }

                if (document.readyState === 'complete') {
                    this.setProgress(Math.max(this.progressValue, 92));
                }
            });
        }
        
        // Only auto-hide if autoShow is enabled (for initial page load)
        if (this.options.autoShow && this.options.autoHide) {
            // Wait for page to fully load
            if (document.readyState === 'complete') {
                this.checkAndHide();
            } else {
                // Use { once: true } to ensure it only fires once
                window.addEventListener('load', () => {
                    this.checkAndHide();
                }, { once: true });
            }
        }
    }
    
    checkAndHide() {
        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.options.minDisplayTime - elapsedTime);

        this.completeProgress();

        if (remainingTime === 0) {
            setTimeout(() => this.hide(), 120);
            return;
        }

        setTimeout(() => {
            this.hide();
        }, remainingTime);
    }
    
    hide() {
        if (!this.loadingScreen) return;

        this.stopProgressSimulation();
        
        // Fade out
        this.loadingScreen.classList.add('fade-out');
        
        // Remove loading class from body
        document.body.classList.remove('loading-active');
        
        // Reset navigation flag
        this.isNavigating = false;
        
        // Remove from DOM after transition completes
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
        }, 450);
    }
    
    show() {
        if (!this.loadingScreen) return;
        
        // Reset start time for minDisplayTime calculation
        this.startTime = Date.now();
        this.setProgress(10);
        this.startProgressSimulation(this.isNavigating ? 'navigation' : 'initial');
        
        this.loadingScreen.classList.remove('fade-out', 'hidden');
        document.body.classList.add('loading-active');
        
        // Restart video
        if (this.loadingVideo) {
            this.loadingVideo.currentTime = 0;
            this.loadingVideo.play().catch(err => {
                console.log('Loading video play prevented:', err);
            });
        }
    }
    
    setupLinkInterception() {
        // Intercept clicks on internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            // Check if it's an internal link
            if (link && this.isInternalLink(link)) {
                // Don't intercept if already navigating
                if (this.isNavigating) {
                    e.preventDefault();
                    return;
                }
                
                // Don't intercept if it has special attributes
                if (link.hasAttribute('data-no-loading') || 
                    link.getAttribute('target') === '_blank' ||
                    link.getAttribute('download')) {
                    return;
                }

                e.preventDefault();
                this.navigateToPage(link.href);
            }
        });
        
        // Handle browser back/forward button - hide loading if page is restored from cache
        window.addEventListener('pageshow', (event) => {
            // If page is restored from bfcache (back-forward cache)
            if (event.persisted) {
                // Force hide loading screen immediately
                if (this.loadingScreen) {
                    this.loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        this.loadingScreen.classList.add('hidden');
                    }, 100);
                }
                document.body.classList.remove('loading-active');
                this.isNavigating = false;
            }
        }, { once: false });
        
        // Note: popstate handler removed — back/forward navigation is handled
        // by the pageshow event above (bfcache) or by the browser's native
        // scroll restoration (full reload). Showing loading here caused
        // body overflow:hidden to reset the scroll position to 0.
    }
    
    isInternalLink(link) {
        // Check if link is internal (same origin)
        const linkUrl = new URL(link.href, window.location.href);
        const currentUrl = new URL(window.location.href);
        
        // Check if it's the same origin and not a hash link
        return linkUrl.origin === currentUrl.origin && 
               !link.href.startsWith('#') &&
               !link.href.includes('#') &&
               linkUrl.pathname !== currentUrl.pathname;
    }
    
    navigateToPage(url) {
        if (this.isNavigating) return;
        
        this.isNavigating = true;

        const backgroundAudio = document.getElementById('global-bg-audio');
        if (backgroundAudio) {
            sessionStorage.setItem('luckkana-bg-audio-time', String(backgroundAudio.currentTime || 0));
        }
        
        // Show loading
        this.show();
        this.setProgress(Math.max(this.progressValue, 24), 'กำลังเปลี่ยนหน้า');
        
        // Navigate immediately so loading reflects actual network speed.
        if (this.options.navigationDisplayTime === 0) {
            window.location.href = url;
            return;
        }

        setTimeout(() => {
            window.location.href = url;
        }, this.options.navigationDisplayTime);
    }
    
    // Static method to create and initialize loading screen
    static init(options = {}) {
        return new LoadingScreen(options);
    }
}

// Auto-initialize if not manually configured
// Use a flag to prevent double initialization
if (!window.loadingScreenInitialized) {
    window.loadingScreenInitialized = true;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.loadingScreen) {
                window.loadingScreen = LoadingScreen.init();
            }
        });
    } else {
        if (!window.loadingScreen) {
            window.loadingScreen = LoadingScreen.init();
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingScreen;
}

/**
 * Ad Management System for QRZen Pro
 * Handles ad loading, placement, and optimization
 */

class AdManager {
    constructor() {
        this.adBlockDetected = false;
        this.adsLoaded = false;
        this.viewportHeight = window.innerHeight;
        this.scrollPosition = 0;
        this.adConfigs = {
            banner728x90: {
                key: '5125b7bd589f58b1a252b20be61925f3',
                width: 728,
                height: 90,
                format: 'iframe'
            },
            banner468x60: {
                key: '9333bd4b4b27a7001e433199ee65afe4',
                width: 468,
                height: 60,
                format: 'iframe'
            },
            banner320x50: {
                key: '579a9f8b87b2218fdce51d30ea187e65',
                width: 320,
                height: 50,
                format: 'iframe'
            },
            rectangle300x250: {
                key: '2bd74ef6b3d861eeaafa5a92156d7c01',
                width: 300,
                height: 250,
                format: 'iframe'
            },
            skyscraper160x600: {
                key: '0f8efc4276aec43d3b8fb0e5352229f2',
                width: 160,
                height: 600,
                format: 'iframe'
            },
            square160x300: {
                key: '8920e6be7b3c4d447825469c76f5cd03',
                width: 160,
                height: 300,
                format: 'iframe'
            }
        };
        
        this.init();
    }

    init() {
        this.detectAdBlock();
        this.setupEventListeners();
        this.loadAdsWhenReady();
    }

    detectAdBlock() {
        // Simple ad block detection
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        testAd.style.position = 'absolute';
        testAd.style.left = '-10000px';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            if (testAd.offsetHeight === 0) {
                this.adBlockDetected = true;
                this.showAdBlockMessage();
            }
            document.body.removeChild(testAd);
        }, 100);
    }

    showAdBlockMessage() {
        const message = document.createElement('div');
        message.className = 'ad-block-message';
        message.innerHTML = `
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: center;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">Ad Blocker Detected</h4>
                <p style="color: #856404; margin: 0; font-size: 14px;">
                    Please consider disabling your ad blocker to support our free service. 
                    Ads help us keep QRZen Pro free for everyone!
                </p>
            </div>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(message, container.firstChild);
        }
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
        document.addEventListener('DOMContentLoaded', this.loadAdsWhenReady.bind(this));
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        this.lazyLoadAds();
    }

    handleResize() {
        this.viewportHeight = window.innerHeight;
        this.refreshResponsiveAds();
    }

    loadAdsWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.loadAllAds(), 1000);
            });
        } else {
            setTimeout(() => this.loadAllAds(), 1000);
        }
    }

    loadAllAds() {
        if (this.adBlockDetected) return;
        
        this.loadHeaderAd();
        this.loadSidebarAds();
        this.loadInlineAds();
        this.loadFooterAd();
        this.loadNativeAds();
        
        this.adsLoaded = true;
    }

    loadHeaderAd() {
        const headerAdContainer = document.getElementById('header-ad');
        if (headerAdContainer && !headerAdContainer.hasChildNodes()) {
            const isMobile = window.innerWidth <= 768;
            const adConfig = isMobile ? this.adConfigs.banner320x50 : this.adConfigs.banner728x90;
            this.createAdUnit(headerAdContainer, adConfig, 'header-ad-unit');
        }
    }

    loadSidebarAds() {
        if (window.innerWidth <= 768) return; // No sidebar ads on mobile
        
        const sidebarAdContainer = document.getElementById('sidebar-ad');
        if (sidebarAdContainer && !sidebarAdContainer.hasChildNodes()) {
            this.createAdUnit(sidebarAdContainer, this.adConfigs.skyscraper160x600, 'sidebar-ad-unit');
        }
    }

    loadInlineAds() {
        const inlineAdContainers = document.querySelectorAll('.inline-ad');
        inlineAdContainers.forEach((container, index) => {
            if (!container.hasChildNodes()) {
                const adConfig = this.adConfigs.rectangle300x250;
                this.createAdUnit(container, adConfig, `inline-ad-unit-${index}`);
            }
        });
    }

    loadFooterAd() {
        const footerAdContainer = document.getElementById('footer-ad');
        if (footerAdContainer && !footerAdContainer.hasChildNodes()) {
            const isMobile = window.innerWidth <= 768;
            const adConfig = isMobile ? this.adConfigs.banner320x50 : this.adConfigs.banner728x90;
            this.createAdUnit(footerAdContainer, adConfig, 'footer-ad-unit');
        }
    }

    loadNativeAds() {
        const nativeAdContainer = document.getElementById('native-ad');
        if (nativeAdContainer && !nativeAdContainer.hasChildNodes()) {
            this.createNativeAd(nativeAdContainer);
        }
    }

    createAdUnit(container, config, id) {
        const adWrapper = document.createElement('div');
        adWrapper.className = 'ad-unit-wrapper';
        adWrapper.innerHTML = `
            <div class="ad-label">Advertisement</div>
            <div id="${id}" class="ad-loading" style="width: ${config.width}px; height: ${config.height}px; margin: 0 auto;"></div>
        `;
        
        container.appendChild(adWrapper);
        
        // Load the actual ad script
        setTimeout(() => {
            this.loadAdScript(config, id);
        }, 500);
    }

    loadAdScript(config, containerId) {
        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.innerHTML = `
            atOptions = {
                'key': '${config.key}',
                'format': '${config.format}',
                'height': ${config.height},
                'width': ${config.width},
                'params': {}
            };
        `;
        
        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = `//www.highperformanceformat.com/${config.key}/invoke.js`;
        script2.async = true;
        
        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(script1);
            container.appendChild(script2);
            container.classList.remove('ad-loading');
        }
    }

    createNativeAd(container) {
        const nativeAdHTML = `
            <div class="ad-native">
                <div class="ad-label">Sponsored Content</div>
                <script async="async" data-cfasync="false" src="//pl27191491.profitableratecpm.com/8fd590db0da4fe1df46c9a9f297ff25a/invoke.js"></script>
                <div id="container-8fd590db0da4fe1df46c9a9f297ff25a"></div>
            </div>
        `;
        container.innerHTML = nativeAdHTML;
    }

    lazyLoadAds() {
        const adContainers = document.querySelectorAll('.ad-container:not(.loaded)');
        adContainers.forEach(container => {
            if (this.isInViewport(container)) {
                container.classList.add('loaded');
                // Trigger ad loading for this container
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    refreshResponsiveAds() {
        // Refresh ads when viewport changes significantly
        const adUnits = document.querySelectorAll('.ad-unit-wrapper');
        adUnits.forEach(unit => {
            // Logic to refresh responsive ads
        });
    }

    // Public methods for manual ad management
    hideAd(adId) {
        const ad = document.getElementById(adId);
        if (ad) {
            ad.style.display = 'none';
            ad.setAttribute('aria-hidden', 'true');
        }
    }

    showAd(adId) {
        const ad = document.getElementById(adId);
        if (ad) {
            ad.style.display = 'block';
            ad.removeAttribute('aria-hidden');
        }
    }

    removeAd(adId) {
        const ad = document.getElementById(adId);
        if (ad) {
            ad.remove();
        }
    }
}

// Initialize Ad Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adManager = new AdManager();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdManager;
}

/**
 * Performance Optimization Script for QRZen Pro
 * Handles Core Web Vitals optimization and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            FCP: null,
            LCP: null,
            FID: null,
            CLS: null,
            TTFB: null
        };
        
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.optimizeImages();
        this.lazyLoadResources();
        this.preloadCriticalResources();
        this.measureCoreWebVitals();
        this.optimizeScrolling();
        this.setupIntersectionObserver();
    }

    // Register Service Worker for caching
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'update-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #4F46E5; color: white; padding: 15px; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <p style="margin: 0 0 10px 0; font-weight: 500;">New version available!</p>
                <button onclick="this.parentElement.parentElement.remove(); window.location.reload();" style="background: white; color: #4F46E5; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer; font-weight: 500;">Update</button>
                <button onclick="this.parentElement.parentElement.remove();" style="background: transparent; color: white; border: 1px solid white; padding: 5px 15px; border-radius: 4px; cursor: pointer; margin-left: 10px;">Later</button>
            </div>
        `;
        document.body.appendChild(notification);
    }

    // Optimize images with lazy loading and WebP support
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px'
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        // Check WebP support
        const supportsWebP = this.supportsWebP();
        const src = img.dataset.src;
        
        if (supportsWebP && src.includes('.jpg') || src.includes('.png')) {
            const webpSrc = src.replace(/\.(jpg|png)$/, '.webp');
            // Try WebP first, fallback to original
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
                img.classList.add('loaded');
            };
            testImg.onerror = () => {
                img.src = src;
                img.classList.add('loaded');
            };
            testImg.src = webpSrc;
        } else {
            img.src = src;
            img.classList.add('loaded');
        }
    }

    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Lazy load non-critical resources
    lazyLoadResources() {
        // Lazy load Font Awesome
        const loadFontAwesome = () => {
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                document.head.appendChild(link);
            }
        };

        // Load after initial page load
        if (document.readyState === 'complete') {
            setTimeout(loadFontAwesome, 1000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(loadFontAwesome, 1000);
            });
        }
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            { href: '/assets/css/style.css', as: 'style' },
            { href: '/logo.jpg', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'style') {
                link.onload = function() {
                    this.onload = null;
                    this.rel = 'stylesheet';
                };
            }
            document.head.appendChild(link);
        });
    }

    // Measure Core Web Vitals
    measureCoreWebVitals() {
        // First Contentful Paint (FCP)
        this.measureFCP();
        
        // Largest Contentful Paint (LCP)
        this.measureLCP();
        
        // First Input Delay (FID)
        this.measureFID();
        
        // Cumulative Layout Shift (CLS)
        this.measureCLS();
        
        // Time to First Byte (TTFB)
        this.measureTTFB();
    }

    measureFCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fcp = entries.find(entry => entry.name === 'first-contentful-paint');
                if (fcp) {
                    this.metrics.FCP = fcp.startTime;
                    this.reportMetric('FCP', fcp.startTime);
                }
            });
            observer.observe({ entryTypes: ['paint'] });
        }
    }

    measureLCP() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lcp = entries[entries.length - 1];
                this.metrics.LCP = lcp.startTime;
                this.reportMetric('LCP', lcp.startTime);
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }
    }

    measureFID() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.metrics.FID = entry.processingStart - entry.startTime;
                    this.reportMetric('FID', this.metrics.FID);
                });
            });
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    measureCLS() {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.metrics.CLS = clsValue;
                this.reportMetric('CLS', clsValue);
            });
            observer.observe({ entryTypes: ['layout-shift'] });
        }
    }

    measureTTFB() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'navigation') {
                        this.metrics.TTFB = entry.responseStart - entry.requestStart;
                        this.reportMetric('TTFB', this.metrics.TTFB);
                    }
                });
            });
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    reportMetric(name, value) {
        // Send to analytics (Google Analytics 4)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: name,
                value: Math.round(value),
                non_interaction: true
            });
        }

        console.log(`${name}: ${value.toFixed(2)}ms`);
    }

    // Optimize scrolling performance
    optimizeScrolling() {
        let ticking = false;

        const updateScrollPosition = () => {
            // Batch scroll-related DOM updates
            requestAnimationFrame(() => {
                // Your scroll-related code here
                ticking = false;
            });
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                updateScrollPosition();
            }
        }, { passive: true });
    }

    // Setup Intersection Observer for animations and lazy loading
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements that should animate in
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                animationObserver.observe(el);
            });
        }
    }

    // Get performance metrics
    getMetrics() {
        return this.metrics;
    }

    // Resource hints for better performance
    addResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const link = document.createElement('link');
            link.rel = hint.rel;
            link.href = hint.href;
            if (hint.crossorigin) link.crossOrigin = hint.crossorigin;
            document.head.appendChild(link);
        });
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}

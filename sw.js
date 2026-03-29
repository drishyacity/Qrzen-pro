/**
 * Service Worker for QRZen Pro
 * Handles caching for improved performance and offline functionality
 */

const CACHE_NAME = 'qrzen-pro-v1.2';
const STATIC_CACHE_NAME = 'qrzen-static-v1.2';
const DYNAMIC_CACHE_NAME = 'qrzen-dynamic-v1.2';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/faq.html',
    '/privacy-policy.html',
    '/terms.html',
    '/assets/css/style.css',
    '/assets/css/ads.css',
    '/assets/js/script.js',
    '/assets/js/ads.js',
    '/logo.jpg',
    '/robots.txt',
    '/sitemap.xml',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Files to cache dynamically
const DYNAMIC_FILES = [
    'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js',
    'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external analytics and ad requests
    if (url.hostname.includes('google-analytics.com') ||
        url.hostname.includes('googletagmanager.com') ||
        url.hostname.includes('googlesyndication.com') ||
        url.hostname.includes('doubleclick.net') ||
        url.hostname.includes('highperformanceformat.com') ||
        url.hostname.includes('profitableratecpm.com')) {
        return;
    }

    // Handle different types of requests
    if (STATIC_FILES.includes(request.url) || STATIC_FILES.includes(url.pathname)) {
        // Static files - cache first strategy
        event.respondWith(cacheFirst(request));
    } else if (DYNAMIC_FILES.some(file => request.url.includes(file))) {
        // Dynamic files - network first strategy
        event.respondWith(networkFirst(request));
    } else if (url.pathname.endsWith('.html') || url.pathname === '/') {
        // HTML files - network first with cache fallback
        event.respondWith(networkFirst(request));
    } else if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
        // Assets - cache first strategy
        event.respondWith(cacheFirst(request));
    } else {
        // Everything else - network first
        event.respondWith(networkFirst(request));
    }
});

// Cache first strategy
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Offline content not available', { status: 503 });
    }
}

// Network first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/index.html');
        }
        
        return new Response('Offline', { status: 503 });
    }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        // Handle offline form submissions when back online
        const formData = await getStoredFormData();
        if (formData) {
            await submitForm(formData);
            await clearStoredFormData();
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notification handler
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/logo.jpg',
            badge: '/logo.jpg',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Open QRZen Pro',
                    icon: '/logo.jpg'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/logo.jpg'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper functions
async function getStoredFormData() {
    // Implementation for retrieving stored form data
    return null;
}

async function submitForm(formData) {
    // Implementation for submitting form data
    return true;
}

async function clearStoredFormData() {
    // Implementation for clearing stored form data
    return true;
}

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('Service Worker: Loaded');

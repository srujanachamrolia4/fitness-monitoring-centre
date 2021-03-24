var cacheName = 'fmc-cache';
var filesToCache = [
  '/',
  '/css/bootstrap-4.5.0.min.css',
  '/css/default.css',
  '/css/font-awesome.min.css',
  '/css/style.css',
  '/fonts/fontawesome-webfont.eot',
  '/fonts/fontawesome-webfont.svg',
  '/fonts/fontawesome-webfont.ttf',
  '/fonts/fontawesome-webfont.woff2',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/images/banner-bg.svg',
  '/images/dietician-contact.png',
  '/images/dietplans.png',
  '/images/favicon.png',
  '/images/footer-bg.svg',
  '/images/header-hero.png',
  '/images/logo-2.png',
  '/images/logo.png',
  '/images/reminder.png',
  '/images/settings.svg',
  '/images/sign-up.png',
  '/images/tracker.png',
  '/js/bootstrap-4.5.0.min.js',
  '/js/jquery-3.5.1-min.js',
  '/js/jquery.cookie.js',
  '/js/jquery.easing.min.js',
  '/js/main.js',
  '/js/modernizr-3.7.1.min.js',
  '/js/scrolling-nav.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all files');
    await cache.addAll(filesToCache);
  })());
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});
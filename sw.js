const CACHE_NAME = 'watchnext-v2';
const ASSETS = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './manifest.json',
  './icons/apple-touch-icon.png',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// App files that should always fetch fresh copies (network-first)
const APP_FILES = ['index.html', 'app.js', 'app.css'];

function isAppFile(url) {
  return APP_FILES.some((f) => url.pathname.endsWith(f));
}

// Install - cache core assets, take over immediately
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate - purge ALL old caches, claim clients immediately
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // API calls: network only (never cache)
  if (url.hostname === 'api.mdblist.com') {
    e.respondWith(fetch(e.request));
    return;
  }

  // App files (HTML, JS, CSS): network-first so updates always apply
  if (isAppFile(url) || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        return caches.match(e.request) || caches.match('./index.html');
      })
    );
    return;
  }

  // Static assets (icons, images): cache-first for speed
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      });
    }).catch(() => {
      if (e.request.destination === 'document') {
        return caches.match('./index.html');
      }
    })
  );
});

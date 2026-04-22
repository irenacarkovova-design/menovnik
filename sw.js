const cacheName = 'menovnik-v2';
const assets = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Instalace - uloží soubory do cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Aktivace - vyčistí starou cache
self.addEventListener('activate', e => {
  console.log('Service Worker aktivován');
});

// Fetch - obsluha požadavků (tady se děje to offline kouzlo)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});

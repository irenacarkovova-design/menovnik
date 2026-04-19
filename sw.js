const cacheName = 'menovnik-v1';
const assets = ['index.html', 'manifest.json', 'style.css', 'app.js'];
self.addEventListener('install', event => {
    event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));{
                return cache.addAll(assets);
            }
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
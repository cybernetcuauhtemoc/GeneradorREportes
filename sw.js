const CACHE_NAME = 'reporte-v10';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  './jspdf.umd.min.js'
];

// Al instalar, guardamos lo básico
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Al activar, borramos caches viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)));
    })
  );
});

// LÓGICA OFFLINE: Intenta red, si falla, usa el cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

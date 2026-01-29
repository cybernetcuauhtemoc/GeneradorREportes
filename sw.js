const CACHE_NAME = 'reporte-pro-v7-cache';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icono.png',
  './jspdf.umd.min.js'
];

// Instalación: Guarda los archivos en el almacenamiento del celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache abierto, guardando recursos...');
      return cache.addAll(assets);
    })
  );
});

// Activación: Limpia versiones viejas del cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Primero buscar en Cache, si no hay, intentar Red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

const CACHE_NAME = 'reporte-pro-v8';
// Solo los archivos críticos indispensables
const assets = [
  'index.html',
  'manifest.json',
  'sw.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Usamos addAll de forma individual para que si uno falla, los demás sigan
      assets.forEach(asset => {
        cache.add(asset).catch(err => console.log("No se pudo cachear: " + asset));
      });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Retorna el archivo de cache o intenta buscarlo en internet
      return response || fetch(event.request).catch(() => {
        // Si no hay red y no está en cache, intenta retornar el index.html
        if (event.request.mode === 'navigate') {
          return caches.match('index.html');
        }
      });
    })
  );
});

// Limpieza de versiones viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

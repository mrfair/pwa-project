//importScripts('/cache-polyfill.js');

self.addEventListener('install', function(event) {
  /*
  event.waitUntil(
    caches.open('demo-cache').then(function(cache) {
      return cache.put('/', new Response("From the cache!"));
    })
  );
  */
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response;
    })
  );
});

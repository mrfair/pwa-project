importScripts('/cache-polyfill.js');

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('demo-cache')
    .then(function(cache) {
      console.log(cache);
      return cache.put('/', new Response("ไปขี้ไป!"));
      /*
      return cache.addAll([
          '/',
          '/style.css',
          '/gopoo.js'
        ]);
      */

    })
    .then(function() {
      console.log('WORKER: install completed');
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log( response ); 
      return response;
    })
  );
});

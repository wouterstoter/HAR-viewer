self.addEventListener('install', function(event) {
  
});

self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request).then(function (response) {
    return response;
  }));
});

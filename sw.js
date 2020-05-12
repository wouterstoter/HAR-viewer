self.addEventListener('install', function(event) {
  
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    console.log(event.request);
    return fetch(event.request).then(function (response) {
      return response;
    });
  );
});

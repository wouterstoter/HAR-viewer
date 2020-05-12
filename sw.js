self.addEventListener('install', function(event) {
  console.log("sw installed")
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    console.log(event.request);
    return fetch(event.request);
  );
});

var har;
self.addEventListener('message', e => {
    har = e.data;
});

self.addEventListener('install', function(event) {
  
});

self.onfetch = function(event) {
    return new Response('The network is totally failed');
  event.respondWith(fetch(event.request).then(function (response) {
    console.log(response);
    return response;
  }));
};

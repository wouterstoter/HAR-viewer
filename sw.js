var har;
self.addEventListener('message', e => {
    har = e.data;
});

self.addEventListener('install', function(event) {
  
});

self.onfetch = function(event) {
    event.respondWith(
    new Response('<p>This is a response that comes from your service worker!</p>', {
       headers: {'Content-Type': 'text/html'}
      })
    );
  /*event.respondWith(fetch(event.request).then(function (response) {
    console.log(response);
    return response;
  }));*/
};

var dont = ["https://wouterstoter.github.io/HAR-viewer/","https://wouterstoter.github.io/HAR-viewer/sw.js"]

var har;
self.addEventListener('message', e => {
    har = e.data;
});

self.addEventListener('install', function(event) {
  
});

self.onfetch = function(event) {console.log(event.request);
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

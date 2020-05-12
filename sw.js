var dont = ["https://wouterstoter.github.io/HAR-viewer/","https://wouterstoter.github.io/HAR-viewer/sw.js"]

var har;
self.addEventListener('message', e => {
    har = e.data;
});

self.addEventListener('install', function(event) {
  
});

self.onfetch = function(event) {console.log(event.request);
    try {
        if (dont.indexOf(event.request.url) == -1 && har) {
            var entry;
            for (e = 0; e < har.entries.length; ++e) {
                if (event.request.url.endsWith(har.entries[e].request.url) && har.entries[e].response && har.entries[e].response.content && har.entries[e].response.content.text) {entry = har.entries[e];break;}
            }
            if (!entry) throw "Error";
            
            event.respondWith(
                new Response(entry.response.content.text, {
                    headers: entry.response.headers
                })
            );
        } else {
            throw "Error";
        }
    } catch(err) {
        event.respondWith(fetch(event.request).then(function (response) {
            console.log(response);
            return response;
        }))
    }
  /*event.respondWith(fetch(event.request).then(function (response) {
    console.log(response);
    return response;
  }));*/
};

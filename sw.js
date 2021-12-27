var har = {};
var base = (new URL(".",location.href)).href;
self.addEventListener('message', e => {
  if (e.data.log) {
    har[e.source.id] = e.data.log.entries;
    e.source.postMessage({"url":base + e.source.id + "/" + har[e.source.id][0].request.url});
  } else if (e.data == "close") {
    delete har[e.source.id];
    for (client in har) {
      ((c) => self.clients.get(client).then(r => typeof r === "undefined" ? delete har[c] : null))(client)
    }
  }
});

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.onfetch = function(event) {
  console.log(event);
  if (event.request.url == location.href || event.request.url == base) {
    return;
  } else if (event.request.url.startsWith(base)) {
    var client = event.request.url.slice(base.length).split("/")[0];
    var cb = base + client + "/";
    var entry = har[client].filter(e => e.request.url == event.request.url.slice(cb.length) && e.request.method == event.request.method)[0]
    if (entry) {
      var headers = new Headers();
      for (h = 0; h < entry.response.headers.length; ++h) {
          headers.append(entry.response.headers[h].name,entry.response.headers[h].value)
      }
      var response;
      if (entry.response.content.encoding == "base64") {
          var encoded = atob(entry.response.content.text)
          var n = encoded.length;
          response = new Uint8Array(n);
          while(n--){
              response[n] = encoded.charCodeAt(n);
          }
      } else {
          response = entry.response.content.text
      }
      event.respondWith(
          new Response(response, {
              status: entry.response.status,
              statusText: entry.response.statusText,
              headers: headers
          })
      );
    } else {
      event.respondWith(new Response(null,{"status":404}));
    }
  } else if ((new URL(event.request.url)).origin != (new URL(base)).origin) {
    event.respondWith(new Promise(async (resolve,reject) => {
      if (har[event.clientId]) {
        var client = event.clientId;
      } else {
        var client = (await self.clients.get(event.clientId)).url.slice(base.length).split("/")[0];
      }
      var cb = base + client + "/";
      resolve(Response.redirect(cb + event.request.url,302));
    }))
  } else if (event.request.referrer && event.request.referrer.startsWith(base)) {
    var client = event.request.referrer.slice(base.length).split("/")[0];
    var cb = base + client + "/";
    var loc = event.request.url.slice((new URL(event.request.url)).origin.length);
    var origin = (new URL(event.request.referrer.slice(cb.length))).origin;
    event.respondWith(Response.redirect(cb + origin + loc,302));
  } else {
    event.respondWith(new Response(null,{"status":404}));
  }
};

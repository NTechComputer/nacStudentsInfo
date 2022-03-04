self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('nacStuInfo').then((cache) => cache.addAll([
        './',
        './icon512.png',
        './icon192.png',
        './logo.svg',
        './index.html',
        './css/main.css',
        './js/main.js'
      ])),
    );
  });
  
  self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });
  
  self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
  });
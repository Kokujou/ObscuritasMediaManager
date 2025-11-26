self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                'index.htm',
                './dist/bundle.js',
                './offline-music/',
                './offline-music/index.html',
                './offline-music/manifest.json',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((resp) => {
            resp || fetch(event.request);
        })
    );
});

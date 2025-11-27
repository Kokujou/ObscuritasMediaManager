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
        fetch(event.request).catch(() => {
            // Wenn fetch fehlschlägt (offline), aus Cache bedienen
            return caches.match(event.request).then((resp) => {
                // Optional: fallback, wenn Datei nicht im Cache ist
                return resp || caches.match('index.htm');
            });
        })
    );
});

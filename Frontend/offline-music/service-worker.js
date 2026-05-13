/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */ const sw = /** @type {any} */ (self);

sw.addEventListener('fetch', (event) => {
    event.respondWith(respondWithCache(event.request));
});

/** @param {Request} request */
async function respondWithCache(request) {
    const cache = await caches.open('offline-music-v1');
    const cached = await cache.match(request);
    if (!cached) return (await fetch(request).catch()) ?? new Response();
    return cached;
}

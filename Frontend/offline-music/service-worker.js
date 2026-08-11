/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */ const sw = /** @type {any} */ (self);

sw.addEventListener('fetch', (event) => {
    event.respondWith(respondWithCache(event.request));
});

/** @param {Request} request */
async function respondWithCache(request) {
    const cache = await caches.open('offline-music-v1');
    const url = new URL(request.url);

    url.search = '';
    url.hash = '';
    const cached = await cache.match(url, { ignoreSearch: true });
    if (!cached) return (await fetch(request).catch()) ?? new Response('', { status: 200 });
    return cached;
}

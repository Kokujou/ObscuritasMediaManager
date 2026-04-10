/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */ const sw = /** @type {any} */ (self);

sw.addEventListener('fetch', (event) => {
    event.respondWith(respondWithCache(event.request));
});

/** @param {Request} request */
async function respondWithCache(request) {
    const cached = await caches.match(request);
    if (!cached) return (await fetch(request)) ?? new Response();
    return cached;
}

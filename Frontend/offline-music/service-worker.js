/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */ const sw = /** @type {any} */ (self);

const CacheName = 'offline-music-v1';

sw.addEventListener('install', () => sw.skipWaiting());

sw.addEventListener('activate', (event) => event.waitUntil(sw.clients.claim()));

sw.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method != 'GET') return;

    const url = new URL(request.url);
    if (url.origin != location.origin) return;
    if (url.pathname.includes('/Backend/')) return;
    // the precache builder must reach the network, otherwise it re-caches what it already has
    if (request.headers.get('x-omm-precache')) return;

    event.respondWith(respondWithCache(request));
});

/** @param {Request} request */
async function respondWithCache(request) {
    const cache = await caches.open(CacheName);

    // ignoreSearch is the only normalization: cache-busting query strings must still hit the
    // precached entry. Never combine it with caching a query-bearing URL.
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
        return await fetch(request);
    } catch {
        // A rejected promise here turns into an opaque network error the page cannot inspect.
        // Answer with a real status instead: navigations get the cached shell, everything else
        // a 504 the caller can branch on.
        if (request.mode == 'navigate') {
            const shell = await cache.match(new URL('./index.html', location.href).href, { ignoreSearch: true });
            if (shell) return shell;
        }

        return new Response('', { status: 504, statusText: 'Offline and not cached' });
    }
}

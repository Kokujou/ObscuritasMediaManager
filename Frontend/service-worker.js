/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */ const sw = /** @type {any} */ (self);

sw.addEventListener('install', (event) => event.waitUntil(cacheApplication()));

sw.addEventListener('fetch', async (event) => {
    event.respondWith(respondIfOffline(event.request));
});

async function cacheApplication() {
    const filesForCaching = [
        'index.htm',
        'colors.css',
        './dist/bundle.js',
        './offline-music/',
        './offline-music/index.html',
        './offline-music/manifest.json',
        './native-components/loading-screen/loading-screen.js',
        './native-components/loading-screen/loading-screen.css',
        './native-components/loading-screen/loading-icon.css',
        './resources/inline-icons/general/loading.icon.svg.js',
        './resources/inline-icons/general/loading-icon.svg',
        './resources/images/background.jpg',
        './offline-music/processor.js',
    ];

    for (var file of filesForCaching) await fetchAndCache(file, true);
}

/** @param {Request | string} request */
async function fetchAndCache(request, force = false) {
    try {
        const response = await fetch(request);
        if (!response.ok) return null;

        try {
            const cache = await caches.open('v1');
            const responseClone = response.clone();
            if ((await cache.match(request)) || force) await cache.put(request, responseClone);
        } catch {}

        return response;
    } catch {
        return null;
    }
}

/** @param {Request} request */
async function respondIfOffline(request) {
    if (!(await caches.has('v1'))) await cacheApplication();

    const response = await fetchAndCache(request);
    if (response) return response;
    const cached = await caches.match(request);
    if (!cached) return (await caches.match('./offline-music/index.html')) ?? new Response();
    return cached;
}

/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */ const sw = /** @type {any} */ (self);

sw.addEventListener('install', (event) => event.waitUntil(cacheApplication()));

sw.addEventListener('fetch', (event) => event.respondWith(fetchWithFallback(event.request)));

async function cacheApplication() {
    const cache = await caches.open('v1');
    await cache.addAll([
        'index.htm',
        './dist/bundle.js',
        './offline-music/',
        './offline-music/index.html',
        './offline-music/manifest.json',
        './native-components/loading-screen/loading-screen.js',
        './native-components/loading-screen/loading-screen.css',
        './native-components/loading-screen/loading-icon.css',
        './resources/inline-icons/general/loading.icon.svg.js',
        './resources/inline-icons/general/loading-icon.svg',
        './offline-music/processor.js',
    ]);
}

/** @param {Request} request */
async function fetchWithFallback(request) {
    try {
        const response = await fetch(request);
        if (!response.ok) return response;

        const responseClone = response.clone();
        const cache = await caches.open('v1');
        if (!(await cache.match(request))) return response;

        await cache.put(request, responseClone);

        return response;
    } catch {
        const cached = await caches.match(request);
        if (!cached) throw new Error('');
        return cached;
    }
}

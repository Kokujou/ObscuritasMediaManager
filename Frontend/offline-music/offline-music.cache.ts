const CacheName = 'offline-music-v1';
const CacheUpdatedStorageKey = 'offline-music-cache-updated';

const FilesForCaching = [
    '../index.htm',
    '../colors.css',
    '../dist/bundle.js',
    './',
    './index.html',
    './manifest.json',
    '../native-components/loading-screen/loading-screen.js',
    '../native-components/loading-screen/loading-screen.css',
    '../native-components/loading-screen/loading-icon.css',
    '../resources/inline-icons/general/loading.icon.svg.js',
    '../resources/inline-icons/general/loading-icon.svg',
    '../resources/images/background.jpg',
    '../resources/icons/app-icon-512.png',
    './processor.js',
    './service-worker.js',
];

export class OfflineMusicCache {
    static get lastUpdated(): Date | null {
        const stored = localStorage.getItem(CacheUpdatedStorageKey);
        if (!stored) return null;

        const timestamp = Number.parseInt(stored);
        if (Number.isNaN(timestamp)) return null;

        return new Date(timestamp);
    }

    /**
     * Downloads every file first and only replaces the existing cache once all of them are in
     * hand. A failed rebuild therefore leaves the previous offline build untouched instead of
     * deleting it and aborting halfway.
     */
    static async cacheApplication() {
        const responses: [string, Response][] = [];
        for (const file of FilesForCaching)
            try {
                const response = await fetch(file, { cache: 'reload', headers: { 'x-omm-precache': '1' } });
                if (!response.ok) throw new Error(response.status + ' - ' + response.statusText);
                responses.push([file, response]);
            } catch (error) {
                alert(
                    'The offline build was not replaced - not all files could be retrieved.' +
                        '\nFile: ' +
                        file +
                        '\nError: ' +
                        (error as Error).message,
                );
                return false;
            }

        await caches.delete(CacheName);
        const cache = await caches.open(CacheName);
        try {
            for (const [file, response] of responses) await cache.put(file, response.clone());
        } catch (error) {
            alert('The offline build could not be stored. Free up storage and try again.\nError: ' + (error as Error).message);
            await caches.delete(CacheName);
            localStorage.removeItem(CacheUpdatedStorageKey);
            return false;
        }

        localStorage.setItem(CacheUpdatedStorageKey, Date.now().toString());
        await this.reinstallServiceWorker();
        location.reload();
        return true;
    }

    static async deleteCache() {
        await caches.delete(CacheName);
        localStorage.removeItem(CacheUpdatedStorageKey);
        for (const registration of await this.getRegistrations()) await registration.unregister();
    }

    /**
     * Re-registers the worker for an existing cache without rebuilding it. iOS prunes unused
     * service worker registrations, and nothing else in the app ever registers one - so without
     * this a cached app can end up permanently uncontrolled and therefore not offline-capable.
     */
    static async ensureServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        if (!(await caches.has(CacheName))) return;
        if ((await this.getRegistrations()).length > 0) return;

        console.warn('offline cache present but no service worker registered, re-registering');
        await this.registerServiceWorker();
    }

    static async reinstallServiceWorker() {
        if (!('serviceWorker' in navigator)) return;

        for (const registration of await this.getRegistrations()) await registration.unregister();
        await this.registerServiceWorker();
    }

    private static async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' });
            // register() resolves before the worker is active; reloading now would leave the page
            // uncontrolled, and nothing would ever register again.
            await this.waitUntilActive(registration);
            console.log('Service Worker registriert mit Scope:', registration.scope);
        } catch (err) {
            console.error('Service Worker Registrierung fehlgeschlagen:', err);
            alert('The service worker could not be installed, the app will not work offline.\nError: ' + err);
        }
    }

    private static waitUntilActive(registration: ServiceWorkerRegistration) {
        const worker = registration.installing ?? registration.waiting ?? registration.active;
        if (!worker || worker.state == 'activated') return Promise.resolve();

        return new Promise<void>((resolve) => {
            const done = () => {
                worker.removeEventListener('statechange', onChange);
                clearTimeout(timeout);
                resolve();
            };
            const onChange = () => {
                if (worker.state == 'activated' || worker.state == 'redundant') done();
            };
            const timeout = setTimeout(done, 10_000);
            worker.addEventListener('statechange', onChange);
        });
    }

    private static async getRegistrations() {
        if (!('serviceWorker' in navigator)) return [];
        return await navigator.serviceWorker.getRegistrations();
    }
}

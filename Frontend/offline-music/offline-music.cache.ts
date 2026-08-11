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
    './processor.js',
    './service-worker.js',
];

export class OfflineMusicCache {
    static async cacheApplication() {
        await this.reinstallServiceWorker();
        await caches.delete('offline-music-v1');
        localStorage.setItem('offline-music-cache-updated', 'never');
        const responses: Map<string, Response> = new Map();
        for (var file of FilesForCaching)
            try {
                const response = await fetch(file);
                if (!response.ok) throw new Error(response.status + ' - ' + response.statusText + ':' + (await response.text()));
                responses.set(file, response);
            } catch (error) {
                alert('not all files could be retrieved. file: ' + file + '\nError: ' + (error as Error).message);
                return;
            }

        const cache = await caches.open('offline-music-v1');

        for (let response of responses) {
            const responseClone = response[1].clone();
            await cache.put(response[0], responseClone);
        }

        localStorage.setItem('offline-music-cache-updated', Date.now().toString());
        location.reload();
    }

    static async reinstallServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                try {
                    const worker = await fetch('./service-worker.js');
                    if (worker.ok)
                        for (let registration of await navigator.serviceWorker.getRegistrations())
                            await registration.unregister();
                    else alert('service worker corrupt');
                } catch (ex) {
                    alert(ex);
                }

                const registration = await navigator.serviceWorker.register('./service-worker.js', {
                    updateViaCache: 'none',
                });
                console.log('Service Worker registriert mit Scope:', registration.scope);
            } catch (err) {
                console.log('Service Worker Registrierung fehlgeschlagen:', err);
            }
        }
    }
}

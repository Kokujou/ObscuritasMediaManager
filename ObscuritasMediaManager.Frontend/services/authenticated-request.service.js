import { changePage } from './extensions/url.extension.js';

export class AuthenticatedRequestService {
    static get AuthHeaderStorageKey() {
        return 'authentication';
    }

    /**
     * @param {RequestInfo} url
     * @param {RequestInit} requestInit
     * @returns {Promise<Response>}
     */
    async fetch(url, requestInit) {
        var response = await fetch(url, requestInit);

        if (response.status == 401) {
            changePage('login');
            await new Promise(() => {});
        }

        return response;
    }
}

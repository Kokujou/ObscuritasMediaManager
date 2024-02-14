import { LoginPage } from '../pages/login-page/login-page.js';
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
        try {
            requestInit.mode = 'cors';
            requestInit.signal = null;
            var response = await window.fetch(url, requestInit);

            if (response.status == 401) {
                changePage(LoginPage);
            }

            if (response.status > 400) throw { httpStatus: response.status };

            return response;
        } catch (err) {
            console.error(err);
            throw { httpStatus: response?.status, status: 9999 };
        }
    }
}

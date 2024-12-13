import { LoginPage } from '../pages/login-page/login-page';
import { changePage } from './extensions/url.extension';

export class AuthenticatedRequestService {
    static get AuthHeaderStorageKey() {
        return 'authentication';
    }

    async fetch(url: RequestInfo, requestInit: RequestInit) {
        var response: Response | null = null;
        try {
            requestInit.mode = 'cors';
            requestInit.signal = null;
            response = await window.fetch(url, requestInit);

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

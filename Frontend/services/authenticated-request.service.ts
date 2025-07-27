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
                document.dispatchEvent(new CustomEvent('login'));
            } else if (response.status == 503) {
                document.dispatchEvent(new CustomEvent('maintenance'));
            }

            if (response.status > 400) throw { httpStatus: response.status };

            return response;
        } catch (err) {
            console.error(err);
            throw { httpStatus: response?.status, status: 9999 };
        }
    }
}

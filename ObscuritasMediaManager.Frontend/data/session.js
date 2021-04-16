import { Observable } from './observable.js';

export const session = {
    /** @type {Observable<string>} */ currentPage: new Observable(''),
};

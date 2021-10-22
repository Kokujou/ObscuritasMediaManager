import { InstrumentModel, MediaModel } from '../obscuritas-media-manager-backend-client.js';
import { Observable } from './observable.js';

export const session = {
    /** @type {Observable<string>} */ currentPage: new Observable(''),
    /** @type {Observable<MediaModel[]>} */ mediaList: new Observable([]),
    /** @type {Observable<InstrumentModel[]>} */ instruments: new Observable([]),
};

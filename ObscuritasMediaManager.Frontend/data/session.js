import { InstrumentModel } from './instrument.model.js';
import { MediaModel } from './media.model.js';
import { Observable } from './observable.js';

export const session = {
    /** @type {Observable<string>} */ currentPage: new Observable(''),
    /** @type {Observable<MediaModel[]>} */ mediaList: new Observable([]),
    /** @type {Observable<InstrumentModel[]>} */ instruments: new Observable([]),
};

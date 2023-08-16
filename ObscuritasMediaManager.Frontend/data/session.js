import { InstrumentModel, MediaModel } from '../obscuritas-media-manager-backend-client.js';
import { MediaService, MusicService } from '../services/backend.services.js';
import { Observable } from './observable.js';

export const session = {
    /** @type {Observable<string>} */ currentPage: new Observable(''),
    /** @type {Observable<MediaModel[]>} */ mediaList: new Observable([]),
    /** @type {Observable<InstrumentModel[]>} */ instruments: new Observable([]),
    initialized: false,
    initialize: async () => {
        session.initialized = false;

        try {
            session.mediaList.next(await MediaService.getAll());
        } catch (err) {
            console.error(err);
        }

        try {
            session.instruments.next(await MusicService.getInstruments());
        } catch (err) {
            console.error(err);
        }

        session.initialized = true;
    },
};

await session.initialize();

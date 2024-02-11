import { InstrumentModel, MediaModel } from '../obscuritas-media-manager-backend-client.js';
import { MediaService, MusicService } from '../services/backend.services.js';
import { Observable } from './observable.js';

export class Session {
    /** @type {Observable<string>} */ static currentPage = new Observable('');
    /** @type {Observable<MediaModel[]>} */ static mediaList = new Observable([]);
    /** @type {Observable<InstrumentModel[]>} */ static instruments = new Observable([]);

    static initialized = false;
    static async initialize() {
        Session.initialized = false;

        try {
            Session.mediaList.next(await MediaService.getAll());
        } catch (err) {
            console.error(err);
        }

        try {
            Session.instruments.next(await MusicService.getInstruments());
        } catch (err) {
            console.error(err);
        }

        Session.initialized = true;
    }
}

await Session.initialize();

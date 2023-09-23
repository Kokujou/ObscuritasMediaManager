import { FallbackAudio } from '../native-components/fallback-audio/fallback-audio.js';
import { InstrumentModel, MediaModel } from '../obscuritas-media-manager-backend-client.js';
import { MediaService, MusicService } from '../services/backend.services.js';
import { Observable } from './observable.js';

export const Session = {
    /** @type {Observable<string>} */ currentPage: new Observable(''),
    /** @type {Observable<MediaModel[]>} */ mediaList: new Observable([]),
    /** @type {Observable<InstrumentModel[]>} */ instruments: new Observable([]),

    /** @type {FallbackAudio} */ Audio: new FallbackAudio(),

    initialized: false,
    initialize: async () => {
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
    },
};

await Session.initialize();

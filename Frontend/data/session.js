import { InstrumentModel, MediaModel, MusicModel } from '../obscuritas-media-manager-backend-client.js';
import { MediaService, MusicService } from '../services/backend.services.js';
import { Observable } from './observable.js';

export class Session {
    /** @type {Observable<string>} */ static currentPage = new Observable('');
    /** @type {Observable<MediaModel[]>} */ static mediaList = new Observable([]);
    /** @type {Observable<MusicModel[]>} */ static tracks = new Observable([]);
    /** @type {Observable<InstrumentModel[]>} */ static instruments = new Observable([]);

    static initialized = false;
    static async initialize() {
        Session.initialized = false;

        var promises = [
            MediaService.getAll()
                .then((list) => Session.mediaList.next(list))
                .catch((err) => console.error(err)),
            MusicService.getAll()
                .then((list) => Session.tracks.next(list))
                .catch((err) => console.error(err)),
            MusicService.getInstruments()
                .then((list) => Session.instruments.next(list))
                .catch((err) => console.error(err)),
        ];

        for (var promise of promises) await promise;

        Session.initialized = true;
    }
}

await Session.initialize();

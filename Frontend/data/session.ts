import { InstrumentModel, MediaModel, MusicModel } from '../obscuritas-media-manager-backend-client';
import { MediaService, MusicService } from '../services/backend.services';
import { Observable } from './observable';

export class Session {
    static currentPage = new Observable('');
    static mediaList = new Observable<MediaModel[]>([]);
    static tracks = new Observable<MusicModel[]>([]);
    static instruments = new Observable<InstrumentModel[]>([]);

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

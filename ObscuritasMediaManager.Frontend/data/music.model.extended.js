import {
    Instrumentation,
    InstrumentType,
    Mood,
    MusicGenre,
    MusicModel,
    Nation,
    Participants,
} from '../obscuritas-media-manager-backend-client.js';
import { session } from './session.js';

export class ExtendedMusicModel extends MusicModel {
    get mappedInstruments() {
        return this.instruments
            .map((name) => session.instruments.current().find((instrument) => instrument.name == name))
            .filter((x) => x);
    }

    /** @type {InstrumentType[]} */ get instrumentTypes() {
        return this.mappedInstruments.map((x) => x.type).filter((instrument, index, self) => self.indexOf(instrument) == index);
    }

    /**
     * @param {import("../obscuritas-media-manager-backend-client.js").IMusicModel} [args]
     * @param {'track' | 'playlist'} [type]
     */
    constructor(args = null, type = 'track') {
        super(args);
        this.type = type;
        if (!this.genres) this.genres = /** @type {MusicGenre[]} */ ([]);
        if (!this.instruments) this.instruments = /** @type {string[]} */ ([]);
    }

    /**
     * @param {File} file
     * @param {string} basePath
     */
    static fromFile(file, basePath) {
        // @ts-ignore
        /** @type {string[]} */ var fileLevels = file.webkitRelativePath.split('/');
        var musicModel = new MusicModel({
            name: fileLevels[fileLevels.length - 1],
            mood1: Mood.Unset,
            mood2: Mood.Unset,
            complete: false,
            genres: [],
            instrumentation: Instrumentation.Mixed,
            instruments: [],
            author: 'unset',
            hash: null,
            language: Nation.Japanese,
            nation: Nation.Japanese,
            participants: Participants.Unset,
            path: `${basePath}\\${file.webkitRelativePath}`,
            rating: 0,
            source: null,
        });

        return musicModel;
    }
}

import {
    Instrumentation,
    InstrumentType,
    Mood,
    MusicGenre,
    MusicModel,
    Nation,
    Participants,
} from '../obscuritas-media-manager-backend-client.js';
import { Session } from './session.js';

export class ExtendedMusicModel extends MusicModel {
    get mappedInstruments() {
        return this.instruments
            .map((name) => Session.instruments.current().find((instrument) => instrument.name == name))
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
     * @param {File[]} files
     * @param {string} basePath
     */
    static createFromFiles(files, basePath) {
        var musicTracks = [];
        for (var i = 0; i < files.length; i++) {
            try {
                var track = ExtendedMusicModel.fromFile(files[i], basePath);
                if (musicTracks.some((x) => x.name == track.name)) continue;
                musicTracks.push(track);
            } catch (err) {
                continue;
            }
        }

        return musicTracks;
    }

    /**
     * @param {File} file
     * @param {string} basePath
     */
    static fromFile(file, basePath) {
        var filePath = file.webkitRelativePath;
        if (!(file.webkitRelativePath?.length > 0)) filePath = file.name;

        // @ts-ignore
        /** @type {string[]} */ var fileLevels = filePath.split('/');
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
            path: `${basePath}\\${filePath}`,
            rating: 0,
            source: null,
        });

        return musicModel;
    }
}

import { InstrumentType, MusicModel } from '../obscuritas-media-manager-backend-client.js';
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

    get displayName() {
        var result = this.name;
        if (this.author && this.author != 'undefined') result = result.concat(` - ${this.author}`);
        if (this.source) result = result.concat(` (${this.source})`);
        return result;
    }

    constructor(args) {
        super(args);
        if (!this.genres) this.genres = [];
        if (!this.instruments) this.instruments = [];
    }

    /**
     * @param {File} file
     * @param {string} basePath
     */
    static fromFile(file, basePath) {
        var musicModel = new MusicModel();
        // @ts-ignore
        /** @type {string[]} */ var fileLevels = file.webkitRelativePath.split('/');
        musicModel.name = fileLevels[fileLevels.length - 1];
        // @ts-ignore
        musicModel.path = `${basePath}\\${file.webkitRelativePath}`;
        musicModel.author = 'undefined';
        return musicModel;
    }
}

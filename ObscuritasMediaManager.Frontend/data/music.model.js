import { InstrumentTypes } from './enumerations/instrument-types.js';
import { Instrumentation } from './enumerations/instrumentation.js';
import { Mood } from './enumerations/mood.js';
import { MusicGenre } from './enumerations/music-genre.js';
import { Nation } from './enumerations/nation.js';
import { Participants } from './enumerations/participants.js';
import { InstrumentModel } from './instrument.model.js';
import { session } from './session.js';

export class MusicModel {
    /** @type {string} */ id;
    /** @type {string} */ name;
    /** @type {string} */ author;
    /** @type {string} */ source;
    /** @type {Mood} */ mood;
    /** @type {Nation} */ language;
    /** @type {Nation} */ nation;
    /** @tyoe {number} */ rating = 0;
    /** @type {Instrumentation} */ instrumentation;
    /** @type {Participants} */ participants;
    /** @type {string} */ instrumentsString;
    /** @type {string[]} */ get instrumentNames() {
        if (!this.instrumentsString) return [];
        return this.instrumentsString.split(',');
    }
    /** @type {InstrumentModel[]} */ get instruments() {
        if (!session.instruments.current() || session.instruments.current().length <= 0) return [];
        return this.instrumentNames.map((instrumentName) =>
            session.instruments.current().find((instrument) => instrument.name == instrumentName)
        );
    }
    set instruments(value) {}

    /** @type {InstrumentTypes[]} */ get instrumentTypes() {
        console.log(this.instruments);
        return this.instruments.map((x) => x.type).filter((instrument, index, self) => self.indexOf(instrument) == index);
    }

    /**@type {string} */ genreString;
    /** @type {MusicGenre[]} */ get genres() {
        if (this.genreString) return this.genreString.split(',');
        return [];
    }
    set genres(value) {}
    /** @type {string} */ src;

    get displayName() {
        var result = this.name;
        if (this.author && this.author != 'undefined') result = result.concat(` - ${this.author}`);
        if (this.source) result = result.concat(` (${this.source})`);
        return result;
    }

    /** @type {boolean} */ complete;

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
        musicModel.src = `${basePath}\\${file.webkitRelativePath}`;
        musicModel.author = 'undefined';
        return musicModel;
    }
}

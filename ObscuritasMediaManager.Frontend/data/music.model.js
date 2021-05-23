import { Genre } from './enumerations/genre.js';
import { InstrumentTypes } from './enumerations/instrument-types.js';
import { Instrumentation } from './enumerations/instrumentation.js';
import { Instruments } from './enumerations/instruments.js';
import { Mood } from './enumerations/mood.js';
import { Nations } from './enumerations/nations.js';
import { Participants } from './enumerations/participants.js';

export class MusicModel {
    /** @type {string} */ name;
    /** @type {string} */ author;
    /** @type {string} */ source;
    /** @type {Mood} */ mood;
    /** @type {Nations} */ language;
    /** @type {Nations} */ nation;
    /** @type {Instrumentation} */ instrumentation;
    /** @type {Participants} */ participants;
    /** @type {string} */ instrumentsString;
    /** @type {Instruments[]} */ get instruments() {
        return [];
    }
    set instruments(value) {}
    /** @type {string} */ instrumentTypesString;
    /** @type {InstrumentTypes[]} */ get instrumentTypes() {
        if (this.instrumentTypesString) return this.instrumentTypesString.split(',');
        return [];
    }
    set instrumentTypes(value) {}
    /**@type {string} */ genreString;
    /** @type {Genre[]} */ get genres() {
        if (this.genreString) return this.genreString.split(',');
        return [];
    }
    set genres(value) {}
    /** @type {string} */ src;

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

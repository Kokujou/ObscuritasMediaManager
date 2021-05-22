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
    /** @type {Instruments} */ instruments;
    /** @type {InstrumentTypes} */ instrumentTypes;
    /** @type {Genre[]} */ genres = [];
    /** @type {string} */ src;

    /**
     * @param {File} file
     */
    static fromFile(file, basePath) {
        var musicModel = new MusicModel();
        // @ts-ignore
        var fileLevels = file.webkitRelativePath.split('/');
        musicModel.name = fileLevels[1];
        // @ts-ignore
        musicModel.src = `${basePath}\\${file.webkitRelativePath}`;
        return musicModel;
    }
}

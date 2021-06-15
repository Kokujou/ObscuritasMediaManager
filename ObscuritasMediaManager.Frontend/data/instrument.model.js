import { InstrumentTypes } from './enumerations/instrument-types.js';
import { GenreModel } from './genre.model.js';

export class InstrumentModel {
    /** @type {string} */ name;
    /** @type {InstrumentTypes} */ type;

    toGenreModel(id) {
        var result = new GenreModel();
        result.id = id;
        result.name = this.name;
        result.section = this.type;
        return result;
    }
}

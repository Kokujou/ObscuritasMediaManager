import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import { session } from '../../data/session.js';
import {
    Instrumentation,
    InstrumentType,
    Mood,
    MusicGenre,
    Nation,
    Participants,
} from '../../obscuritas-media-manager-backend-client.js';

export class MusicFilterOptions {
    /** @type {string} */ search = '';
    /** @type {CheckboxState} */ showComplete = CheckboxState.Ignore;
    /** @type {CheckboxState} */ showPlaylists = CheckboxState.Ignore;
    /** @type {CheckboxState} */ showDeleted = CheckboxState.Forbid;

    languages = new FilterEntry(Object.values(Nation), CheckboxState.Require);
    ratings = new FilterEntry(['1', '2', '3', '4', '5'], CheckboxState.Require);
    nations = new FilterEntry(Object.values(Nation), CheckboxState.Require);
    instrumentTypes = new FilterEntry(Object.values(InstrumentType));
    instruments = new FilterEntry(
        session.instruments.current().map((x) => x.name),
        CheckboxState.Ignore
    );
    moods = new FilterEntry(Object.values(Mood), CheckboxState.Ignore);
    genres = new FilterEntry(Object.values(MusicGenre), CheckboxState.Ignore);
    instrumentations = new FilterEntry(Object.values(Instrumentation), CheckboxState.Ignore);
    participants = new FilterEntry(Object.values(Participants), CheckboxState.Require);

    /**
     * @param {string} text
     */
    static fromJSON(text) {
        var object = JSON.parse(text);
        for (var key in object) if (object[key]?.states) Object.setPrototypeOf(object[key], FilterEntry.prototype);
        return object;
    }
}

import {
    Instrumentation,
    InstrumentType,
    Mood,
    MusicGenre,
    Nation,
    Participants,
} from '../obscuritas-media-manager-backend-client.js';
import { CheckboxState } from './enumerations/checkbox-state.js';
import { FilterEntry } from './filter-entry.js';
import { session } from './session.js';

export class MusicFilterOptions {
    /** @type {string} */ search = '';
    /** @type {CheckboxState} */ complete = CheckboxState.Ignore;
    /** @type {CheckboxState} */ showPlaylists = CheckboxState.Ignore;

    languages = new FilterEntry(Object.values(Nation), CheckboxState.Allow);
    ratings = new FilterEntry(['1', '2', '3', '4', '5'], CheckboxState.Allow);
    nations = new FilterEntry(Object.values(Nation), CheckboxState.Allow);
    instrumentTypes = new FilterEntry(Object.values(InstrumentType));
    instruments = new FilterEntry(
        session.instruments.current().map((x) => x.name),
        CheckboxState.Ignore
    );
    moods = new FilterEntry(Object.values(Mood), CheckboxState.Ignore);
    genres = new FilterEntry(Object.values(MusicGenre), CheckboxState.Ignore);
    instrumentations = new FilterEntry(Object.values(Instrumentation), CheckboxState.Ignore);
    participants = new FilterEntry(Object.values(Participants), CheckboxState.Allow);
}

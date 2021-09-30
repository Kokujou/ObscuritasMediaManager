import { CheckboxState } from './enumerations/checkbox-state.js';
import { InstrumentTypes } from './enumerations/instrument-types.js';
import { Instrumentation } from './enumerations/instrumentation.js';
import { Mood } from './enumerations/mood.js';
import { MusicGenre } from './enumerations/music-genre.js';
import { Nation } from './enumerations/nation.js';
import { Participants } from './enumerations/participants.js';
import { FilterEntry } from './filter-entry.js';
import { session } from './session.js';

export class MusicFilterOptions {
    /** @type {string} */ title = '';
    /** @type {CheckboxState} */ complete = CheckboxState.Ignore;

    languages = new FilterEntry(Nation, CheckboxState.Allow);
    ratings = new FilterEntry(['1', '2', '3', '4', '5'], CheckboxState.Allow);
    nations = new FilterEntry(Nation, CheckboxState.Allow);
    instrumentTypes = new FilterEntry(InstrumentTypes);
    instruments = new FilterEntry(
        session.instruments.current().map((x) => x.name),
        CheckboxState.Ignore
    );
    moods = new FilterEntry(Mood, CheckboxState.Allow);
    genres = new FilterEntry(MusicGenre);
    instrumentations = new FilterEntry(Instrumentation, CheckboxState.Allow);
    participants = new FilterEntry(Participants, CheckboxState.Allow);
}

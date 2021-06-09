import { CheckboxState } from './enumerations/checkbox-state.js';
import { Genre } from './enumerations/genre.js';
import { InstrumentTypes } from './enumerations/instrument-types.js';
import { Instrumentation } from './enumerations/instrumentation.js';
import { Instruments } from './enumerations/instruments.js';
import { Mood } from './enumerations/mood.js';
import { Nations } from './enumerations/nations.js';
import { Participants } from './enumerations/participants.js';
import { FilterEntry } from './filter-entry.js';

export class MusicFilterOptions {
    /** @type {string} */ title;
    languages = new FilterEntry(Nations);
    nations = new FilterEntry(Nations);
    instrumentTypes = new FilterEntry(InstrumentTypes, CheckboxState.Ignore);
    instruments = new FilterEntry(Instruments, CheckboxState.Ignore);
    moods = new FilterEntry(Mood);
    genres = new FilterEntry(Genre, CheckboxState.Ignore);
    instrumentations = new FilterEntry(Instrumentation);
    participants = new FilterEntry(Participants);
}

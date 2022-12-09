import { MusicModel } from '../obscuritas-media-manager-backend-client.js';

/** @typedef {keyof MusicSortingProperties & (keyof MusicModel | 'unset') } SortingProperties */

export const MusicSortingProperties = {
    name: 'Name',
    author: 'Autor',
    source: 'Quelle',
    nation: 'Herkunftsland',
    language: 'Sprache',
    rating: 'Bewertung',
    mood1: 'Stimmung',
    instrumentation: 'Instrumentverteilung',
    participants: 'Mitgliederzahl',
    unset: 'Keine Sortierung',
};

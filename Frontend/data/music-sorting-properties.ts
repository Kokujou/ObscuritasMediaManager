import { MusicModel } from '../obscuritas-media-manager-backend-client';

export enum MusicSortingProperties {
    name = 'Name',
    author = 'Autor',
    source = 'Quelle',
    language = 'Sprache',
    rating = 'Bewertung',
    mood1 = 'Stimmung',
    instrumentation = 'Instrumentverteilung',
    participants = 'Mitgliederzahl',
    unset = 'Keine Sortierung',
}
export type SortingProperties = keyof typeof MusicSortingProperties & (keyof MusicModel | 'unset');

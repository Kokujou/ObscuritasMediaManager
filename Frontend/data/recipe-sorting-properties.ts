import { RecipeModel } from '../obscuritas-media-manager-backend-client';

export const RecipeSortingProperties: Partial<Record<keyof RecipeModel | 'unset', string>> = {
    title: 'Name',
    nation: 'Cuisine',
    rating: 'Bewertung',
    difficulty: 'Schwierigkeit',
    course: 'Gang',
    technique: 'Technik',
    unset: 'Keine Sortierung',
};

import { RecipeModel } from '../obscuritas-media-manager-backend-client';

export const RecipeSortingProperties: Partial<Record<keyof RecipeModel | 'unset', string>> = {
    title: 'Name',
    rating: 'Bewertung',
    difficulty: 'Schwierigkeit',
    unset: 'Keine Sortierung',
};

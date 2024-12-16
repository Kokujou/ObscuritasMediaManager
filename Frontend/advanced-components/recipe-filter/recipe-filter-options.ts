import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { FilterEntry } from '../../data/filter-entry';
import { TimeSpan } from '../../data/timespan';
import { CookingTechnique, Course, Language } from '../../obscuritas-media-manager-backend-client';

export const RecipeTimes = {
    totalTime: 'Gesamt',
    cookingTime: 'Arbeit',
    preparationTime: 'Vorbereitung',
};

export class RecipeFilterOptions {
    search = '';
    showDeleted = CheckboxState.Forbid;

    nations = new FilterEntry(Object.values(Language), CheckboxState.Require);
    ratings = new FilterEntry(['0', '1', '2', '3', '4', '5'], CheckboxState.Ignore);
    maxDifficulty = 5;
    techniques = new FilterEntry(Object.values(CookingTechnique));
    courses = new FilterEntry(Object.values(Course));
    ingredients = new FilterEntry<string>([]);
    filterByTime: keyof typeof RecipeTimes = 'totalTime';
    maxDuration = new TimeSpan();

    static fromJSON(text: string) {
        var object = JSON.parse(text);
        for (var key in object) if (object[key]?.states) Object.setPrototypeOf(object[key], FilterEntry.prototype);
        return object;
    }
}

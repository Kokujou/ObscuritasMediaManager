import { CheckboxState } from '../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../data/filter-entry.js';

export class MusicFilterService {
    /**
     * @template T
     * @param {T[]} list
     * @param {FilterEntry<T>} filter
     * @param {keyof T} filterProperty
     */
    static applyArrayFilter(list, filter, filterProperty) {
        var allowedValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Allow);
        var forbiddenValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Forbid);

        var results = list.filter((item) => {
            var array = item[filterProperty];
            if (!Array.isArray(array)) throw new Error('property must be an array');
            var anotherArray = array;
            return (
                allowedValues.every((genre) => anotherArray.some((x) => x == genre)) &&
                anotherArray.every((genre) => forbiddenValues.every((x) => x != genre))
            );
        });
        list.length = 0;
        list.push(...results);
    }

    /**
     * @template T
     * @param {T[]} list
     * @param {FilterEntry<T>} filter
     * @param {keyof T} filterProperty
     */
    static applyPropertyFilter(list, filter, filterProperty, emptyAllowsUndefined = false) {
        var allowedValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Allow);
        var forbiddenValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Forbid);

        var results = list.filter((item) => {
            var property = item[filterProperty];
            if (allowedValues.includes(`${property}`)) return true;
            if (allowedValues.length == 0 && emptyAllowsUndefined && !property) return true;
            return false;
        });
        list.length = 0;
        list.push(...results);
    }
}

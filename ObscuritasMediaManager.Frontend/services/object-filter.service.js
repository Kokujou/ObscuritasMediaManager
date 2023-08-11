import { CheckboxState } from '../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../data/filter-entry.js';

export class ObjectFilterService {
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
            var array = item[filterProperty] ?? [];
            if (!Array.isArray(array)) throw new Error('property must be an array');
            var itemPropertyValues = array;
            return (
                allowedValues.every((allowedItem) => itemPropertyValues.some((anotherItem) => anotherItem == allowedItem)) &&
                itemPropertyValues.every((value) => !forbiddenValues.some((forbiddenItem) => forbiddenItem == value))
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
    static applyPropertyFilter(list, filter, filterProperty) {
        // var allowedValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Allow);
        var forbiddenValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Forbid);
        var results = list.filter((item) => {
            var property = item[filterProperty];
            if (forbiddenValues.includes(`${property}`)) return false;
            if (forbiddenValues.length > 0 && !property) return false;
            return true;
        });
        list.length = 0;
        list.push(...results);
    }

    /**
     * @template {Object} T
     * @param {T[]} list
     * @param {string} search
     * @param  {(keyof T)[]} properties
     */
    static applyMultiPropertySearch(list, search, ...properties) {
        var results = list.filter((item) =>
            properties.some((prop) => item[prop].toString().toLowerCase().includes(search.toLowerCase()))
        );
        list.length = 0;
        list.push(...results);
    }
}

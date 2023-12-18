import { CheckboxState } from '../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../data/filter-entry.js';

export class ObjectFilterService {
    /**
     * @template T
     * @template U
     * @param {T[]} list
     * @param {FilterEntry<U>} filter
     * @param {keyof T} filterProperty
     * @param {(item: T) => string} idSelector
     */
    static applyArrayFilter(list, filter, filterProperty, idSelector = (x) => x) {
        var allowedValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Require);
        var forbiddenValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Forbid);
        var results = list.filter((item) => {
            var array = item[filterProperty] ?? [];
            if (!Array.isArray(array)) throw new Error('property must be an array');
            var itemPropertyValues = array;
            return (
                allowedValues.every((allowedItem) =>
                    itemPropertyValues.some((anotherItem) => idSelector(anotherItem) == allowedItem)
                ) &&
                itemPropertyValues.every((value) => !forbiddenValues.some((forbiddenItem) => forbiddenItem == idSelector(value)))
            );
        });
        list.length = 0;
        list.push(...results);
    }

    /**
     * @template T
     * @template U
     * @param {T[]} list
     * @param {FilterEntry<U>} filter
     * @param {keyof T} filterProperty
     * @param {CheckboxState} ignoreState
     */
    static applyPropertyFilter(list, filter, filterProperty, ignoreState = CheckboxState.Require) {
        var results = this.#filterForbidden([...list], filter, filterProperty);
        if (ignoreState != CheckboxState.Require) results = this.#filterNotForced([...results], filter, filterProperty);

        list.length = 0;
        list.push(...results);
    }

    /**
     * @template T
     * @param {T[]} list
     * @param {CheckboxState} state
     * @param {keyof T} filterProperty
     */
    static applyValueFilter(list, state, filterProperty) {
        if (state == CheckboxState.Ignore) return;
        var results = list.filter((x) => x[filterProperty] == (state == CheckboxState.Require));
        list.length = 0;
        list.push(...results);
    }

    /**
     * @template T
     * @template U
     * @param {T[]} list
     * @param {FilterEntry<U>} filter
     * @param {keyof T} filterProperty
     */
    static #filterForbidden(list, filter, filterProperty) {
        var forbiddenValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Forbid);
        if (forbiddenValues.length == 0) return list;

        return list.filter((item) => !item[filterProperty] || !forbiddenValues.includes(`${item[filterProperty]}`));
    }

    /**
     * @template T
     * @template U
     * @param {T[]} list
     * @param {FilterEntry<U>} filter
     * @param {keyof T} filterProperty
     */
    static #filterNotForced(list, filter, filterProperty) {
        var forcedValues = Object.keys(filter.states).filter((value) => filter.states[value] == CheckboxState.Require);
        if (forcedValues.length == 0) return list;

        return list.filter((item) => forcedValues.includes(`${item[filterProperty]}`));
    }

    /**
     * @template {Object} T
     * @param {T[]} list
     * @param {string} search
     * @param  {(keyof T)[]} properties
     */
    static applyMultiPropertySearch(list, search, ...properties) {
        var results = list.filter((item) =>
            properties.some((prop) => (item[prop] ?? '').toString().toLowerCase().includes(search.toLowerCase()))
        );
        list.length = 0;
        list.push(...results);
    }

    /**
     * @template U
     * @param {{min, max}} filter
     * @param {U[]} list
     * @param {keyof U} property
     */
    static applyRangeFilter(list, filter, property) {
        if (!filter.max || !filter.min) return list;
        var results = list.filter((x) => x[property] >= filter.min && x[property] <= filter.max);
        list.length = 0;
        list.push(...results);
    }

    /**
     * @template T
     * @template U
     * @param {T[]} list
     * @param {FilterEntry<U>} filter
     * @param  {(item: T)=>U[]} selector
     */
    static applyMultiPropertyFilter(list, filter, selector) {
        var results = list.filter((item) => {
            var array = selector(item);
            if (array.some((prop) => filter.forbidden.includes(prop))) return false;
            if (!filter.required.every((prop) => array.includes(prop))) return false;
            return true;
        });

        list.length = 0;
        list.push(...results);
    }
}

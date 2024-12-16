import { CheckboxState } from '../data/enumerations/checkbox-state';
import { FilterEntry } from '../data/filter-entry';

export type FilterType<T, K extends KeyOfType<T, FilterEntry<any>>> = T[K] extends FilterEntry<infer U> ? U : never;

export type KeyOfType<TIn, TType> = { [K in keyof TIn]: TIn[K] extends TType ? K : never }[keyof TIn];

export class ObjectFilterService {
    static applyArrayFilter<T, U extends string | number | symbol>(
        list: T[],
        filter: FilterEntry<U>,
        filterProperty: keyof T,
        idSelector = (x: T) => x as any
    ) {
        var allowedValues = Object.keys(filter.states).filter((value) => filter.states[value as U] == CheckboxState.Require);
        var forbiddenValues = Object.keys(filter.states).filter((value) => filter.states[value as U] == CheckboxState.Forbid);
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

    static applyPropertyFilter<T, U extends string | number | symbol>(
        list: T[],
        filter: FilterEntry<U>,
        filterProperty: keyof T,
        ignoreState = CheckboxState.Require
    ) {
        let results = this.#filterForbidden([...list], filter, filterProperty);
        if (ignoreState != CheckboxState.Require) results = this.#filterNotForced([...results], filter, filterProperty);

        list.length = 0;
        list.push(...results);
    }

    static applyValueFilter<T>(list: T[], state: CheckboxState, filterProperty: KeyOfType<T, boolean>) {
        if (state == CheckboxState.Ignore) return;
        var results = list.filter((x) => (x[filterProperty] as any) == (state == CheckboxState.Require));
        list.length = 0;
        list.push(...results);
    }

    static #filterForbidden<T, U extends string | number | symbol>(list: T[], filter: FilterEntry<U>, filterProperty: keyof T) {
        var forbiddenValues = Object.keys(filter.states).filter((value) => filter.states[value as U] == CheckboxState.Forbid);
        if (forbiddenValues.length == 0) return list;

        return list.filter((item) => !forbiddenValues.includes(`${item[filterProperty]}`));
    }

    static #filterNotForced<T, U extends string | number | symbol>(list: T[], filter: FilterEntry<U>, filterProperty: keyof T) {
        var forcedValues = Object.keys(filter.states).filter((value) => filter.states[value as U] == CheckboxState.Require);
        if (forcedValues.length == 0) return list;

        return list.filter((item) => forcedValues.includes(`${item[filterProperty]}`));
    }

    static applyMultiPropertySearch<T>(list: T[], search: string, ...properties: (keyof T)[]) {
        var results = list.filter((item) =>
            properties.some((prop) => `${item[prop] ?? ''}`.toLowerCase().trim().includes(search.toLowerCase().trim()))
        );
        list.length = 0;
        list.push(...results);
    }

    static applyRangeFilter<U>(list: U[], filter: { min: number | null; max: number | null }, property: keyof U) {
        if (!filter.max || filter == undefined || filter == null) return list;
        //@ts-ignore
        var results = list.filter((x) => x[property] >= filter.min && x[property] <= filter.max);
        list.length = 0;
        list.push(...results);
    }

    static applyMultiPropertyFilter<T, U extends string | number | symbol>(
        list: T[],
        filter: FilterEntry<U>,
        selector: (item: T) => U[]
    ) {
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

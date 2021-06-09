import { CheckboxState } from './enumerations/checkbox-state.js';

/**
 * @template T
 *
 */
export class FilterEntry {
    /**@type  { Object.<string, CheckboxState >} */ states;

    /**
     * @param {T} type
     */
    constructor(type, defaultValue = CheckboxState.Allow) {
        this.states = {};
        Object.values(type).forEach((x) => (this.states[x] = defaultValue));
    }
}

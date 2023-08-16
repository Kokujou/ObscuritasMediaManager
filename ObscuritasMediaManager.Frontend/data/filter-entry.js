import { CheckboxState } from './enumerations/checkbox-state.js';

/**
 * @template T
 *
 */
export class FilterEntry {
    /**@type  { Object.<string, CheckboxState >} */ states;

    /**
     * @param {T} type
     * @param {CheckboxState} defaultValue
     */
    constructor(type, defaultValue = CheckboxState.Ignore) {
        this.states = {};
        Object.values(type).forEach((x) => (this.states[x] = defaultValue));
    }
}

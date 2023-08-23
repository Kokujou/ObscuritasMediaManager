import { CheckboxState } from './enumerations/checkbox-state.js';

/**
 * @template U
 * @template {Object.<string, U> | U[]} T
 */
export class FilterEntry {
    get required() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Allow)
            .map((x) => /** @type {U} */ (x[0]));
    }

    get ignored() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Ignore)
            .map((x) => /** @type {U} */ (x[0]));
    }

    get forbidden() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Forbid)
            .map((x) => /** @type {U} */ (x[0]));
    }

    /**@type  {Object.<U, CheckboxState>} */ states;

    /**
     * @param {T} type
     * @param {CheckboxState} defaultValue
     */
    constructor(type, defaultValue = CheckboxState.Ignore) {
        this.states = /** @type {any} */ ({});
        this._type = Object.values(type)[0];
        Object.values(type).forEach((x) => (this.states[x] = defaultValue));
    }
}

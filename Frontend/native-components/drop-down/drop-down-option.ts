import { CheckboxState } from '../../data/enumerations/checkbox-state';

/** @template T */
export class DropDownOption {
    /** @type {string} */ text;
    /** @type {T} */ value;
    /** @type {CheckboxState} */ state;
    /** @type {string} */ color;

    /**
     * @template T
     * @param {Partial<DropDownOption<T>> & {value: T}} obj
     */
    static create(obj) {
        var newObj = new DropDownOption(obj.value);
        newObj = Object.assign(newObj, obj);
        return newObj;
    }

    /**
     * @template T
     * @param {T[]} values
     * @param {T} defaultValue
     */
    static createSimpleArray(values, defaultValue) {
        return values.map((key) =>
            DropDownOption.create({
                value: key,
                text: `${key}`,
                state: key == defaultValue ? CheckboxState.Ignore : CheckboxState.Forbid,
            })
        );
    }

    /**
     * @param {T} value
     */
    constructor(value) {
        this.value = value;
    }
}

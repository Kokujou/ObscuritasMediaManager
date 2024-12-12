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
    static create(obj: Partial<DropDownOption<T>> & { value: T; }) {
        var newObj = new DropDownOption(obj.value);
        newObj = Object.assign(newObj, obj);
        return newObj;
    }

    /**
     * @template T
     * @param {T[]} values
     * @param {T} defaultValue
     */
    static createSimpleArray(values: T[], defaultValue: T) {
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
    constructor(value: T) {
        this.value = value;
    }
}

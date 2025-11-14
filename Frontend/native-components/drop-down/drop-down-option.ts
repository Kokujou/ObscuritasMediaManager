import { CheckboxState } from '../../data/enumerations/checkbox-state';

export class DropDownOption<T> {
    text: string;
    value: T;
    category?: string;
    state: CheckboxState;
    color: string;

    static create<T>(obj: Partial<DropDownOption<T>> & { value: T }) {
        var newObj = new DropDownOption(obj.value);
        newObj = Object.assign(newObj, obj);
        return newObj;
    }

    static createSimpleArray<T>(values: T[], defaultValue: T) {
        return values.map((key) =>
            DropDownOption.create({
                value: key,
                text: `${key ?? '---'}`,
                state: key == defaultValue ? CheckboxState.Ignore : CheckboxState.Forbid,
            })
        );
    }

    constructor(value: T) {
        this.value = value;
        this.text = `${value}`;
    }
}

import { CheckboxState } from './enumerations/checkbox-state';

export class FilterEntry<T extends string | number | symbol> {
    get required() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Require)
            .map((x) => x[0] as T);
    }

    get ignored() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Ignore)
            .map((x) => x[0] as T);
    }

    get forbidden() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Forbid)
            .map((x) => x[0] as T);
    }

    states: Record<T, CheckboxState>;
    keyType: T;

    constructor(type: T[], defaultValue = CheckboxState.Ignore) {
        this.states = {} as any;
        for (var key of type) this.states[key] = defaultValue;
    }

    setKey(key: T, value: CheckboxState) {
        this.states[key] = value;
    }
}

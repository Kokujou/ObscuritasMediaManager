import { CheckboxState } from './enumerations/checkbox-state';

export class FilterEntry<U> {
    get required() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Require)
            .map((x) => x[0] as U);
    }

    get ignored() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Ignore)
            .map((x) => x[0] as U);
    }

    get forbidden() {
        return Object.entries(this.states)
            .filter((x) => x[1] == CheckboxState.Forbid)
            .map((x) => x[0] as U);
    }

    states: { [key: string]: CheckboxState };

    constructor(type: string[], defaultValue = CheckboxState.Ignore) {
        this.states = {} as any;
        for (var key of type) this.states[key] = defaultValue;
    }

    setKey(key: string, value: CheckboxState) {
        this.states[key] = value;
    }
}

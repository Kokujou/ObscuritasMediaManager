export {};

declare global {
    interface ObjectConstructor {
        keysOf<T extends {}>(target: T): (keyof T & string)[];
        entriesOf<T extends {}>(target: T): [keyof T, unknown][];
    }

    interface JSON {
        parseOrDefault<T>(input: string): T | null;
    }
}

JSON.parseOrDefault = (input: string) => {
    try {
        return JSON.parse(input);
    } catch {
        null;
    }
};

Object.keysOf = function <T extends {}>(target: T) {
    return Object.keys(target) as (keyof T & string)[];
};

Object.entriesOf = function <T extends {}>(target: T) {
    return Object.entries(target) as [keyof T, unknown][];
};

export function nameof<T extends Function>(object: T, property: keyof T['prototype'] & string) {
    return property;
}

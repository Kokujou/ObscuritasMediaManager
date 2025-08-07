export {};

declare global {
    interface ObjectConstructor {
        keysOf<T extends {}>(target: T): (keyof T)[];
        entriesOf<T extends {}>(target: T): [keyof T, unknown][];
    }
}

Object.keysOf = function <T extends {}>(target: T) {
    return Object.keys(target) as (keyof T)[];
};

Object.entriesOf = function <T extends {}>(target: T) {
    return Object.entries(target) as [keyof T, unknown][];
};

export function nameof<T extends Function>(object: T, property: keyof T['prototype'] & string) {
    return property;
}

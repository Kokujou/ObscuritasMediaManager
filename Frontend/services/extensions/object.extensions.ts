/**
 * @template T
 * @param {T} target
 * @param {any} value
 * @returns {keyof T}
 */
export function getKeyFor(target: T, value: any) {
    return /** @type {(keyof T)[]} */ (Object.keys(target)).find((key) => target[key] == value);
}

/**
 * @template {function} T
 * @param {T} object
 * @param {keyof T["prototype"] & string} property
 */
export function nameof(object: T, property: keyof T["prototype"] & string) {
    return property;
}

/**
 * @template T
 * @param {T} target
 * @param {any} value
 * @returns {keyof T}
 */
export function getKeyFor(target, value) {
    return /** @type {(keyof T)[]} */ (Object.keys(target)).find((key) => target[key] == value);
}

/**
 * @template T
 * @param {T} object
 * @param {keyof T} property
 * @returns
 */
export function nameof(object, property) {
    return property;
}

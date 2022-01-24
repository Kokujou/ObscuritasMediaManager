/**
 * @template T
 * @param {T} target
 * @param {any} value
 * @returns {keyof T}
 */
export function getKeyFor(target, value) {
    return /** @type {(keyof T)[]} */ (Object.keys(target)).find((key) => target[key] == value);
}

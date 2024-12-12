export class ProperObject {
    /**
     * @template T
     * @param {T} object
     */
    static keys(object: T) {
        return /** @type {(keyof T)[]} */ (Object.keys(object));
    }
}

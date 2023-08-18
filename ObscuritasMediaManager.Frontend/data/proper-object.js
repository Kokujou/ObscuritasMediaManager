export class ProperObject {
    /**
     * @template T
     * @param {T} object
     */
    static keys(object) {
        return /** @type {(keyof T)[]} */ (Object.keys(object));
    }
}

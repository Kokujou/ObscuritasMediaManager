/**
 * @param {KeyboardEvent} event
 */
export function isNumberKey(event: KeyboardEvent) {
    if (Number.parseInt(event.key) >= 0 || event.key.length > 1) {
        event.returnValue = true;
        return true;
    }
    event.returnValue = false;
    return false;
}

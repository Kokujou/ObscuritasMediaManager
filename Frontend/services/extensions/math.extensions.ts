export function minmax(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/** @param {string} color */
export function colorCodeToNumber(color) {
    return Number.parseInt(color.replace('#', '0x'));
}

/**
 *
 * @param {number} number
 * @param {number} digits
 */
export function decToHex(number, digits) {
    // Konvertiere die Dezimalzahl in eine Hexadezimalzahl
    const hex = number.toString(16);

    // Füge führende Nullen hinzu, wenn die Hexadezimalzahl weniger als 2 Zeichen hat
    const paddedHex = hex.padStart(digits, '0');

    return paddedHex;
}

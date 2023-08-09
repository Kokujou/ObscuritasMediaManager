export function minmax(value, min, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/** @param {string} color */
export function colorCodeToNumber(color) {
    return Number.parseInt(color.replace('#', '0x'));
}

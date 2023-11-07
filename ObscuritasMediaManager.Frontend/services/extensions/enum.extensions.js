export class Enum {
    /**
     * @template {Object.<string, any>} TEnum
     * @param {TEnum} enumType
     * @param {(keyof TEnum)[]} excludes
     */
    static nextValue(enumType, currentValue, ...excludes) {
        var entries = Object.entries(enumType).filter((x) => !excludes.includes(x[0]));
        if (!currentValue) return entries[0][1];

        var currentIndex = entries.findIndex((entry) => entry[1] == currentValue) ?? 0;
        if (currentIndex >= entries.length - 1) return entries[0][1];
        return entries[currentIndex + 1][1];
    }
}

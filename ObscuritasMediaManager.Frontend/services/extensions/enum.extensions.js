export class Enum {
    /**
     * @param {{ [s: string]: any; } } enumType
     * @param {string} currentValue
     * @param {boolean} [excludeFirst]
     */
    static nextValue(enumType, currentValue, excludeFirst = true) {
        var enumKeys = Object.keys(enumType);
        var currentIndex = enumKeys.findIndex((x) => enumType[x] == currentValue);

        if (currentIndex < enumKeys.length - 1) currentIndex++;
        else currentIndex = excludeFirst ? 1 : 0;

        return Object.values(enumType)[currentIndex];
    }
}

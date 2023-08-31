export class Enum {
    /**
     * @param {{ [s: string]: any; } } enumType
     * @param {string} currentValue
     * @param {boolean} [excludeFirst]
     */
    static nextValue(enumType, currentValue, excludeFirst = true) {
        var enumKeys = Object.keys(enumType);
        var currentIndex = enumKeys.findIndex((x) => enumType[x] == currentValue);

        if (currentIndex >= enumKeys.length - 1) return currentValue;

        return Object.values(enumType)[currentIndex + 1];
    }

    /**
     * @param {{ [s: string]: any; } } enumType
     * @param {string} currentValue
     * @param {boolean} [excludeFirst]
     */
    static previousValue(enumType, currentValue, excludeFirst = true) {
        var enumKeys = Object.keys(enumType);
        var currentIndex = enumKeys.findIndex((x) => enumType[x] == currentValue);

        if (currentIndex <= (excludeFirst ? 1 : 0)) return currentValue;

        currentIndex--;
        return Object.values(enumType)[currentIndex];
    }
}

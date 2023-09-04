export class Enum {
    /**
     * @param {{ [s: string]: any; } } enumType
     * @param {string} currentValue
     */
    static nextValue(enumType, currentValue, continueOnEnd = false) {
        var values = Object.values(enumType);
        if (!currentValue) return values[0];
        var enumKeys = Object.keys(enumType);
        var currentIndex = enumKeys.findIndex((x) => enumType[x] == currentValue);

        if (currentIndex >= enumKeys.length - 1) return continueOnEnd ? values[0] : currentValue;

        return values[currentIndex + 1];
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

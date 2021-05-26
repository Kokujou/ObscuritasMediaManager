export class Enum {
    static nextValue(enumType, currentValue) {
        var enumkeys = Object.keys(enumType);
        var currentIndex = enumkeys.findIndex((x) => enumType[x] == currentValue);
        if (currentIndex < enumkeys.length - 1) currentIndex++;
        else currentIndex = 0;

        return Object.values(enumType)[currentIndex];
    }
}

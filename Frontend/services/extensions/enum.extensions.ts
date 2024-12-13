export class Enum {
    static nextValue<TEnum extends Object>(enumType: TEnum, currentValue: any, ...excludes: (keyof TEnum)[]) {
        var entries = Object.entries(enumType).filter((x) => !excludes.includes(x[0] as keyof TEnum));
        if (!currentValue) return entries[0][1];

        var currentIndex = entries.findIndex((entry) => entry[1] == currentValue) ?? 0;
        if (currentIndex >= entries.length - 1) return entries[0][1];
        return entries[currentIndex + 1][1];
    }
}

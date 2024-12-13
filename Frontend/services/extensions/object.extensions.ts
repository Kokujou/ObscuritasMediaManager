export function getKeyFor<T extends Object>(target: T, value: any) {
    return Object.keys(target).find((key) => target[key as keyof T] == value) as keyof T;
}

export function nameof<T extends Function>(object: T, property: keyof T['prototype'] & string) {
    return property;
}

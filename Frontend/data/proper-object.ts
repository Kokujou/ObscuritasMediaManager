export class ProperObject {
    static keys<T extends Object>(object: T) {
        return Object.keys(object) as (keyof T)[];
    }
}

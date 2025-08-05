export {};

declare global {
    interface Array<T> {
        randomize(): T[];
        getDistance(selectedEntry: T, targetEntry: T): number;
        groupBy<T>(this: T[], selector: (item: T) => any): Record<string, T[]>;
        groupByKey<K extends keyof T>(key: K): Record<string, T[]>;
        groupAndSelectBy<K extends keyof T, V extends keyof T>(groupKey: K, selectKey: V): Record<string, T[V][]>;
        union(...others: T[][]): T[];
        distinct(): T[];
        distinctBy(selector: (item: T) => any): T[];
        orderBy(...selectors: ((item: T) => any)[]): T[];
    }

    interface ArrayConstructor {
        createRange(from: number, to: number): number[];
    }

    interface FileList {
        toIterator(this: FileList): IteratorObject<File, undefined, unknown>;
    }
}

Array.prototype.randomize = function <T>(this: T[]): T[] {
    const array = [...this];
    const resultList: T[] = [];
    while (array.length > 0) {
        const randomIndex = Math.floor(Math.random() * array.length);
        resultList.push(array.splice(randomIndex, 1)[0]);
    }
    return resultList;
};

Array.prototype.groupByKey = function <T, K extends keyof T>(this: T[], key: K): Record<string, T[]> {
    return this.reduce((rv, x) => {
        const groupKey = String(x[key]);
        (rv[groupKey] = rv[groupKey] || []).push(x);
        return rv;
    }, {} as Record<string, T[]>);
};

Array.prototype.groupBy = function <T>(this: T[], selector: (item: T) => any): Record<string, T[]> {
    return this.reduce((rv, x) => {
        const groupKey = selector(x);
        (rv[groupKey] = rv[groupKey] || []).push(x);
        return rv;
    }, {} as Record<string, T[]>);
};

Array.prototype.groupAndSelectBy = function <T, K extends keyof T, V extends keyof T>(
    this: T[],
    groupKey: K,
    selectKey: V
): Record<string, T[V][]> {
    return this.reduce((rv, x) => {
        const key = String(x[groupKey]);
        (rv[key] = rv[key] || []).push(x[selectKey]);
        return rv;
    }, {} as Record<string, T[V][]>);
};

Array.prototype.union = function <T>(this: T[], ...others: T[][]): T[] {
    return Array.from(new Set([...this, ...others.flatMap((x) => x)]));
};

Array.prototype.distinct = function <T>(this: T[]): T[] {
    return this.filter((value, index, array) => array.indexOf(value) === index);
};

Array.prototype.distinctBy = function <T>(this: T[], selector: (item: T) => any): T[] {
    return this.filter((value, index, array) => array.findIndex((x) => selector(x) === selector(value)) === index);
};

Array.prototype.orderBy = function <T>(this: T[], ...selectors: ((item: T) => any)[]): T[] {
    return this.sort((a, b) => {
        for (const selector of selectors) {
            if (selector(a) < selector(b)) return -1;
            if (selector(a) > selector(b)) return 1;
        }
        return 0;
    });
};

Array.createRange = function (from: number, to: number): number[] {
    const diff = to - from;
    return [...new Array(diff + 1).keys()].map((x) => x + from);
};

FileList.prototype.toIterator = function* () {
    for (let i = 0; i < this.length; i++) yield this[i];
    return undefined;
};

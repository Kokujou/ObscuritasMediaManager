export {};

declare global {
    interface Array<T> {
        randomize(seed?: number): T[];
        getDistance(selectedEntry: T, targetEntry: T): number;
        groupBy<T, U extends string | number>(this: T[], selector: (item: T) => U): Record<U, T[]>;
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

Array.prototype.randomize = function <T>(this: T[], seed?: number): T[] {
    const random = seededRandom(seed ?? 0);
    return this.map((item) => ({ item, rnd: random.next() }))
        .orderBy((x) => x.rnd)
        .map((x) => x.item);
};

Array.prototype.groupByKey = function <T, K extends keyof T>(this: T[], key: K): Record<string, T[]> {
    return this.reduce((rv, x) => {
        const groupKey = String(x[key]);
        (rv[groupKey] = rv[groupKey] || []).push(x);
        return rv;
    }, {} as Record<string, T[]>);
};

Array.prototype.groupBy = function <T, U extends string | number>(this: T[], selector: (item: T) => U): Record<U, T[]> {
    return this.reduce((rv, x) => {
        const groupKey = selector(x) ?? '';
        (rv[groupKey] = rv[groupKey] || []).push(x);
        return rv;
    }, {} as Record<U, T[]>);
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

export function seededRandom(seed: number) {
    return {
        next: function () {
            seed |= 0;
            seed = (seed + 0x6d2b79f5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        },
    };
}

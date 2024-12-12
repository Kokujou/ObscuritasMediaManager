/**
 * @param {any[]} array
 */
export function randomizeArray(array: any[]) {
    var resultList = [];
    while (array.length > 0) {
        var randomIndex = Math.floor(Math.random() * array.length);
        resultList.push(array.splice(randomIndex, 1)[0]);
    }
    return resultList;
}

/**
 * @template T
 * @param {T[]} array
 * @param {(item: T)=> any} selector
 */
export function sortBy(array: T[], selector: (item: T) => any) {
    return array.sort((a, b) => (selector(a) > selector(b) ? 1 : selector(a) === selector(b) ? 0 : -1));
}

/**
 * @template T
 * @param {T[]} array
 * @param {T} selectedEntry
 * @param {T} targetEntry
 */
export function getDistance(array: T[], selectedEntry: T, targetEntry: T) {
    var selectedIndex = array.indexOf(selectedEntry);
    var targetIndex = array.indexOf(targetEntry);
    return targetIndex - selectedIndex;
}

/**
 * @template T
 * @param {T[]} array
 * @param {keyof T} key
 * @returns { { [key:string] : T[] } }
 */
export function groupBy(array: T[], key: keyof T) {
    if (!array) return {};
    return array.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, /** @type {any} */ ({}));
}

export function createRange(from, to) {
    var diff = to - from;
    return [...new Array(diff + 1).keys()].map((x) => x + from);
}

/**
 * @template T
 * @param  {...T[]} params
 */
export function union(...params: T[][]) {
    if (params.length == 0) return [];
    if (params.length == 1) return params[0];
    return Array.from(new Set(params.flatMap((x) => x)));
}

/**
 * @template T
 * @param {T[]} array
 */
export function distinct(array: T[]) {
    return array.filter((value, index) => array.indexOf(value) === index);
}

/**
 * @param {any[]} array
 */
export function randomizeArray(array) {
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
export function sortBy(array, selector) {
    return array.sort((a, b) => (selector(a) > selector(b) ? 1 : selector(a) === selector(b) ? 0 : -1));
}

/**
 * @template T
 * @param {T[]} array
 * @param {T} selectedEntry
 * @param {T} targetEntry
 */
export function getDistance(array, selectedEntry, targetEntry) {
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
export function groupBy(array, key) {
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
export function union(...params) {
    if (params.length == 0) return [];
    if (params.length == 1) return params[0];
    return Array.from(new Set(params.flatMap((x) => x)));
}

/**
 * @template T
 * @param {T[]} array
 */
export function distinct(array) {
    return array.filter((value, index) => array.indexOf(value) === index);
}

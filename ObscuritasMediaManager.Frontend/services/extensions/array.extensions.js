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
 * @param {keyof T} property
 */
export function sortyBy(array, property) {
    return array.sort((a, b) => (a[property] > b[property] ? 1 : a[property] === b[property] ? 0 : -1));
}

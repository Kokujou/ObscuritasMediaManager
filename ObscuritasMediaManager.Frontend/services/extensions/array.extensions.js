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

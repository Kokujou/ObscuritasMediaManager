export function randomizeArray(array: any[]) {
    var resultList = [];
    while (array.length > 0) {
        var randomIndex = Math.floor(Math.random() * array.length);
        resultList.push(array.splice(randomIndex, 1)[0]);
    }
    return resultList;
}

export function sortBy<T>(array: T[], selector: (item: T) => any) {
    return array.sort((a, b) => (selector(a) > selector(b) ? 1 : selector(a) === selector(b) ? 0 : -1));
}

export function getDistance<T>(array: T[], selectedEntry: T, targetEntry: T) {
    var selectedIndex = array.indexOf(selectedEntry);
    var targetIndex = array.indexOf(targetEntry);
    return targetIndex - selectedIndex;
}

export function groupBy<T, U extends keyof T>(array: T[], key: U) {
    if (!array) return {};
    return array.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {} as any) as { [key: string]: T[] };
}

export function createRange(from: number, to: number) {
    var diff = to - from;
    return [...new Array(diff + 1).keys()].map((x) => x + from);
}

export function union<T>(...params: T[][]) {
    if (params.length == 0) return [];
    if (params.length == 1) return params[0];
    return Array.from(new Set(params.flatMap((x) => x)));
}

export function distinct<T>(array: T[]) {
    return array.filter((value, index) => array.indexOf(value) === index);
}

/** @param {string} query */ export function getQueryValue(query) {
    var queries = location.search.substr(1).split('&');
    var desiredQuery = queries.find((x) => x.split('=')[0] == query);

    if (!desiredQuery) return undefined;
    return desiredQuery.split('=')[1];
}

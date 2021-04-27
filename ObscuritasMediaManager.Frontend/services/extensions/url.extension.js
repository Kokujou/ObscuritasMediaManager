import { session } from '../../data/session.js';

/** @param {string} query */ export function getQueryValue(query) {
    var queries = location.search.substr(1).split('&');
    var desiredQuery = queries.find((x) => x.split('=')[0] == query);

    if (!desiredQuery) return undefined;
    return desiredQuery.split('=')[1];
}

export function changePage(target, search = '') {
    session.currentPage.next(target);
    var newUrl = 'https://localhost/' + search + `#${target}`;
    history.pushState(null, null, newUrl);
}

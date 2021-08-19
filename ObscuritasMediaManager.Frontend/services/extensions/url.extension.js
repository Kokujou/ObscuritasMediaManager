import { session } from '../../data/session.js';

/** @param {string} query */ export function getQueryValue(query) {
    var queries = location.search.substr(1).split('&');
    var desiredQuery = queries.find((x) => x.split('=')[0] == query);

    if (!desiredQuery) return undefined;
    return decodeURIComponent(desiredQuery.split('=')[1]);
}

/**
 * @param {string} target
 */
export function changePage(target, search = '', reflectInHistory = true) {
    var newUrl = '/' + search + `#${target}`;
    if (reflectInHistory) history.pushState(null, null, newUrl);
    else history.replaceState(null, null, newUrl);
    session.currentPage.next(target);
}

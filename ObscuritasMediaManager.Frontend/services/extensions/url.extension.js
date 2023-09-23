import { Session } from '../../data/session.js';
import { pascalToKeabCase } from './convention.extension.js';
import { setFavicon } from './style.extensions.js';

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
    setFavicon(null);
    var newUrl = '/' + search + `#${target}`;
    if (reflectInHistory) history.pushState(null, null, newUrl);
    else history.replaceState(null, null, newUrl);
    Session.currentPage.next(target);
}

/** @param  {{isPage: boolean, name: string}} component */
export function getPageName(component) {
    var componentName = pascalToKeabCase(component.name);
    return componentName.replace('-page', '');
}

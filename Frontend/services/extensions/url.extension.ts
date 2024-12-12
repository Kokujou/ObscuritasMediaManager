import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { pascalToKeabCase } from './convention.extension';
import { setFavicon } from './style.extensions';

/** @param {string} query */ export function getQueryValue(query: string) {
    var queries = location.search.substr(1).split('&');
    var desiredQuery = queries.find((x) => x.split('=')[0] == query);

    if (!desiredQuery) return undefined;
    return decodeURIComponent(desiredQuery.split('=')[1]);
}

/**
 * @template T
 * @typedef {{ [K in keyof T]: T[K] extends Function ? never : K }[keyof T]} NonMethodKeys
 */

/**
 * @template {import('../../custom-elements').Page} T
 * @template {Omit<InstanceType<T>, keyof LitElementBase>} U
 * @param {T} target
 * @param {Partial<Pick<U, NonMethodKeys<U>>>} [params]
 */
export function changePage(target: T, params: Partial<Pick<U, NonMethodKeys<U>>> = {}, reflectInHistory = true) {
    setFavicon('');
    var newUrl = new URL(location.href);
    newUrl.search = '';
    newUrl.hash = '';
    var paramEntries = Object.entries(params ?? {});
    if (paramEntries.length > 0) newUrl.search = '?' + paramEntries.map((x) => `${x[0]}=${x[1]}`).join('&');
    newUrl.hash = '#' + getPageName(target);
    if (reflectInHistory) history.pushState(null, '', newUrl);
    else history.replaceState(null, '', newUrl);

    Session.currentPage.next(getPageName(target));
}

/** @returns {any} */
export function queryToObject() {
    var result = {};
    if (location.search) {
        var params = location.search.slice(1).split('&');
        for (var param of params) {
            var pair = param.split('=');
            result[pair[0]] = pair[1];
        }
    }

    return result;
}

/** @param  {import('../../custom-elements').Page} component */
export function getPageName(component: import('../../custom-elements').Page) {
    var componentName = pascalToKeabCase(component.name);
    return componentName.replace('-page', '');
}

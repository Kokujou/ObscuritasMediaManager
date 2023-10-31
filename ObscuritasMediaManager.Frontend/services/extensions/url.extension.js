import { LitElementBase } from '../../data/lit-element-base.js';
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
 * @template T
 * @typedef {{ [K in keyof T]: T[K] extends Function ? never : K }[keyof T]} NonMethodKeys
 */

/**
 * @template {import('../../custom-elements.js').Page} T
 * @template {Omit<InstanceType<T>, keyof LitElementBase>} U
 * @param {T} target
 * @param {Partial<Pick<U, NonMethodKeys<U>>>} [params]
 */
export function changePage(target, params = {}, reflectInHistory = true) {
    setFavicon('');
    var search = '';
    var paramEntries = Object.entries(params ?? {});
    if (paramEntries.length > 0) search = '?' + paramEntries.map((x) => `${x[0]}=${x[1]}`).join('&');
    var newUrl = '/' + search + `#${target}`;
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

/** @param  {import('../../custom-elements.js').Page} component */
export function getPageName(component) {
    var componentName = pascalToKeabCase(component.name);
    return componentName.replace('-page', '');
}

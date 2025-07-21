import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { Page } from '../../data/util-types';
import { pascalToKeabCase } from './convention.extension';

export function getQueryValue(query: string) {
    var queries = location.search.substr(1).split('&');
    var desiredQuery = queries.find((x) => x.split('=')[0] == query);

    if (!desiredQuery) return undefined;
    return decodeURIComponent(desiredQuery.split('=')[1]);
}

export type NonMethodKeys<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];

export function changePage<T extends Page, U extends Omit<InstanceType<T>, keyof LitElementBase>>(
    target: T,
    params: Partial<Pick<U, NonMethodKeys<U>>> = {},
    reflectInHistory = true
) {
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

export function queryToObject() {
    var result = {} as { [key: string]: any };
    if (location.search) {
        var params = location.search.slice(1).split('&');
        for (var param of params) {
            var pair = param.split('=');
            result[pair[0]] = pair[1];
        }
    }

    return result;
}

export function getPageName(component: Page) {
    var componentName = pascalToKeabCase(component.name);
    return componentName.replace('-page', '');
}

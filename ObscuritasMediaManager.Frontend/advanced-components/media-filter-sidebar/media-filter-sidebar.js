import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { renderMediaFilterSidebarStyles } from './media-filter-sidebar.css.js';
import { renderMediaFilterSidebar } from './media-filter-sidebar.html.js';
import { MediaFilter } from './media-filter.js';

export class MediaFilterSidebar extends LitElementBase {
    static get styles() {
        return renderMediaFilterSidebarStyles();
    }

    static get properties() {
        return {
            filter: { type: Object, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {MediaFilter} */ this.filter = new MediaFilter();
    }

    render() {
        return renderMediaFilterSidebar(this);
    }

    /**
     * @template {keyof MediaFilter} T
     * @param {T} property
     * @param {MediaFilter[T]} value
     */
    changeFilterProperty(property, value) {
        this.filter[property] = value;
        this.requestUpdate(undefined);
        this.dispatchEvent(new Event('change', { composed: true }));
        localStorage.setItem(`media.search`, JSON.stringify(this.filter));
    }

    /**
     * @template T
     * @typedef {{[K in keyof T]: T[K] extends FilterEntry ? K : never}[keyof T]} StringKeyOf
     */

    /**
     * @template {StringKeyOf<MediaFilter>} T
     * @param {T} property
     * @param {string} key
     * @param {CheckboxState} value
     */
    toggleFilter(property, key, value) {
        var newFilter = this.filter[property];
        newFilter.states ??= {};
        newFilter.states[key] = value;
        this.changeFilterProperty(property, newFilter);
    }

    resetFilter() {
        var newFilter = new MediaFilter();
        for (var prop in newFilter) this.filter[prop] = newFilter[prop];
        this.requestUpdate(undefined);
        this.dispatchEvent(new Event('change', { composed: true }));
        localStorage.setItem(`media.search`, JSON.stringify(this.filter));
    }
}

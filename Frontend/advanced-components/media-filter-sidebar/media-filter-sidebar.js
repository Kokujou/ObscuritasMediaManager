import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
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
        /** @type {MediaFilter} */ this.filter = new MediaFilter([]);
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
        this.notifyFilterUpdated();
    }

    /**
     * @template T
     * @typedef {{[K in keyof T]: T[K] extends FilterEntry ? K : never}[keyof T]} FilterEntryKeyOf
     */

    /**
     * @template T
     * @template {FilterEntryKeyOf<T>} K
     * @typedef {T[K] extends FilterEntry<infer U> ?  U : never} FilterType
     */

    /**
     * @template {FilterEntryKeyOf<MediaFilter>} T
     * @param {T} property
     * @param {string} key
     * @param {CheckboxState} value
     */
    setFilterProperty(property, key, value) {
        var newFilter = this.filter[property];
        newFilter.states[key] = value;
        this.changeFilterProperty(property, newFilter);
    }

    /**
     * @template {MediaFilter[T]['_type']} U
     * @template {FilterEntryKeyOf<MediaFilter>} T
     * @param {T} property
     * @param {U[] | 'all'} keys
     * @param {CheckboxState} value
     */
    setArrayFilter(property, keys, value) {
        var filter = this.filter[property].states;
        if (keys == 'all') for (let key in filter) filter[key] = value;
        else for (let key of keys) filter[key] = value;
        this.notifyFilterUpdated();
    }

    resetFilter() {
        var newFilter = new MediaFilter(Object.keys(this.filter.genres.states));
        for (var prop in newFilter) this.filter[prop] = newFilter[prop];
        this.notifyFilterUpdated();
    }

    notifyFilterUpdated() {
        this.requestFullUpdate();
        this.dispatchEvent(new Event('change', { composed: true }));
        localStorage.setItem(`media.search`, JSON.stringify(this.filter));
    }

    async openGenreDialog() {
        var dialog = await GenreDialog.startShowingWithGenres(this.filter.genres);
        dialog.addEventListener(
            'accept',
            /** @param {CustomEvent<GenreDialogResult>} e */ (e) => {
                var acceptedGenreIds = e.detail.acceptedGenres.map((x) => x.id);
                var forbiddendGenreIds = e.detail.forbiddenGenres.map((x) => x.id);
                this.setArrayFilter('genres', 'all', CheckboxState.Ignore);
                this.setArrayFilter('genres', acceptedGenreIds, CheckboxState.Require);
                this.setArrayFilter('genres', forbiddendGenreIds, CheckboxState.Forbid);
                this.notifyFilterUpdated();
                dialog.remove();
            }
        );
    }
}

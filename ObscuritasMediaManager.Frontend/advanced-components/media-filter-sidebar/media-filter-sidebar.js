import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { FilterEntry } from '../../data/filter-entry.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { GenreModel } from '../../obscuritas-media-manager-backend-client.js';
import { GenreService } from '../../services/backend.services.js';
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
    }

    async connectedCallback() {
        var genres = await GenreService.getAll();
        /** @type {MediaFilter} */ this.filter = new MediaFilter(genres.map((x) => x.id));
        await super.connectedCallback();
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
     * @typedef {{[K in keyof T]: T[K] extends FilterEntry ? K : never}[keyof T]} StringKeyOf
     */

    /**
     * @template T
     * @template {StringKeyOf<T>} K
     * @typedef {T[K] extends FilterEntry<infer U> ?  U : never} FilterType
     */

    /**
     * @template {StringKeyOf<MediaFilter>} T
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
     * @template {StringKeyOf<MediaFilter>} T
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

    /**
     * @param {StringKeyOf<MediaFilter>} filter
     * @param {string[]} selectedValues
     */
    handleDropdownChange(filter, selectedValues) {
        Object.keys(this.filter[filter].states).forEach((key) => {
            this.setFilterProperty(filter, key, selectedValues.includes(key) ? CheckboxState.Ignore : CheckboxState.Forbid);
        });
    }

    resetFilter() {
        var newFilter = new MediaFilter(Object.keys(this.filter.genres.states));
        for (var prop in newFilter) this.filter[prop] = newFilter[prop];
        this.notifyFilterUpdated();
    }

    notifyFilterUpdated() {
        this.requestUpdate(undefined);
        this.dispatchEvent(new Event('change', { composed: true }));
        localStorage.setItem(`media.search`, JSON.stringify(this.filter));
    }

    async openGenreDialog() {
        var genres = await GenreService.getAll();
        var allowedGenres = genres.filter((x) => this.filter.genres.allowed.includes(x.id));
        var forbiddenGenres = genres.filter((x) => this.filter.genres.forbidden.includes(x.id));
        var dialog = GenreDialog.show({
            genres,
            allowedGenres,
            forbiddenGenres,
            allowAdd: true,
            allowRemove: true,
            allowThreeValues: true,
        });

        dialog.addEventListener(
            'accept',
            /** @param {CustomEvent<GenreDialogResult>} e */ (e) => {
                var acceptedGenreIds = e.detail.acceptedGenres.map((x) => x.id);
                var forbiddendGenreIds = e.detail.forbiddenGenres.map((x) => x.id);
                this.setArrayFilter('genres', acceptedGenreIds, CheckboxState.Allow);
                this.setArrayFilter('genres', forbiddendGenreIds, CheckboxState.Forbid);
                this.notifyFilterUpdated();
                dialog.remove();
            }
        );

        dialog.addEventListener(
            'add-genre',
            /** @param {CustomEvent<{section, name}>} e */ async (e) => {
                await GenreService.addGenre(e.detail.section, e.detail.name);
                dialog.options.genres = await GenreService.getAll();
                dialog.requestUpdate(undefined);
            }
        );

        dialog.addEventListener(
            'remove-genre',
            /** @param {CustomEvent<GenreModel>} e */ async (e) => {
                await GenreService.removeGenre(e.detail.id);
                dialog.options.genres = await GenreService.getAll();
                dialog.requestUpdate(undefined);
            }
        );

        dialog.addEventListener('decline', () => dialog.remove());
    }
}
import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { GenreModel } from '../../data/genre.model.js';
import { MusicFilterOptions } from '../../data/music-filter-options.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { LitElement } from '../../exports.js';
import { renderMusicFilterStyles } from './music-filter.css.js';
import { renderMusicFilter } from './music-filter.html.js';

export class MusicFilter extends LitElement {
    static get styles() {
        return renderMusicFilterStyles();
    }

    static get properties() {
        return {
            filter: { type: Object, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {MusicFilterOptions} */ this.filter = new MusicFilterOptions();
        /** @type {Subscription[]} */ this.subscriptions = [];
    }

    connectedCallback() {
        super.connectedCallback();
        this.subscriptions.push(
            session.instruments.subscribe((newValue) => {
                if (!newValue) return;

                for (var instrument of newValue) {
                    if (!this.filter.instruments.states[instrument.name])
                        this.filter.instruments.states[instrument.name] = CheckboxState.Ignore;
                }
                this.requestUpdate(undefined);
            })
        );
    }

    render() {
        return renderMusicFilter(this);
    }

    /**
     * @param {keyof MusicFilterOptions} filter
     * @param {string} enumKey
     * @param {CheckboxState} state
     */
    toggleFilter(filter, enumKey, state) {
        if (filter == 'title') {
            this.filter[filter] = state;
            return;
        }

        this.filter[filter].states[enumKey] = state;

        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    /**
     * @param {keyof MusicFilterOptions} filter
     */
    resetFilter(filter) {
        if (filter == 'title') {
            this.filter[filter] = '';
            return;
        }

        var newFilterOptions = new MusicFilterOptions();
        this.filter[filter] = newFilterOptions[filter];
        this.requestUpdate(undefined);
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    resetAllFilters() {
        this.filter = new MusicFilterOptions();
        this.requestUpdate(undefined);
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    /**
     * @param {keyof MusicFilterOptions} filter
     * @param {string[]} selectedValues
     */
    handleDropdownChange(filter, selectedValues) {
        if (filter == 'title') return;
        Object.keys(this.filter[filter].states).forEach((key) => {
            this.toggleFilter(filter, key, selectedValues.includes(key) ? CheckboxState.Allow : CheckboxState.Forbid);
        });
    }

    async showInstrumentFilterPopup() {
        var instruments = session.instruments.current().map((item, index) => item.toGenreModel(index));
        /** @type {GenreModel[]} */ var allowedInstruments = [];
        /** @type {GenreModel[]} */ var forbiddenInstruments = [];

        for (var key of Object.keys(this.filter.instruments.states)) {
            if (this.filter.instruments.states[key] == CheckboxState.Allow) allowedInstruments.push(instruments.find((x) => x.name == key));
            else if (this.filter.instruments.states[key] == CheckboxState.Forbid)
                forbiddenInstruments.push(instruments.find((x) => x.name == key));
        }

        var genreDialog = GenreDialog.show(instruments, allowedInstruments, forbiddenInstruments, true);
        genreDialog.addEventListener('accept', (/** @type {CustomEvent<GenreDialogResult>} */ e) => {
            for (var key of Object.keys(this.filter.instruments.states)) {
                this.filter.instruments.states[key] = CheckboxState.Ignore;
            }
            for (var allowed of e.detail.acceptedGenres) {
                this.filter.instruments.states[allowed.name] = CheckboxState.Allow;
                this.filter.instrumentTypes.states[allowed.section] = CheckboxState.Allow;
            }
            for (var forbidden of e.detail.forbiddenGenres) {
                this.filter.instruments.states[forbidden.name] = CheckboxState.Forbid;
            }

            this.requestUpdate(undefined);
            this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
            genreDialog.remove();
        });
        genreDialog.addEventListener('decline', () => {
            genreDialog.remove();
        });
    }

    canFilterInstrumentType(type) {
        var forcedInstruments = Object.keys(this.filter.instruments.states)
            .filter((x) => this.filter.instruments.states[x] == CheckboxState.Allow)
            .map((x) => session.instruments.current().find((instrument) => instrument.name == x));

        return !forcedInstruments.some((x) => x && x.type == type);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
    }
}
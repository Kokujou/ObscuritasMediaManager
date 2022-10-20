import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { MusicFilterOptions } from '../../data/music-filter-options.js';
import { MusicSortingProperties } from '../../data/music-sorting-properties.js';
import { Subscription } from '../../data/observable.js';
import { session } from '../../data/session.js';
import { SortingDirections } from '../../data/sorting-directions.js';
import { GenreDialogResult } from '../../dialogs/dialog-result/genre-dialog.result.js';
import { GenreDialog } from '../../dialogs/genre-dialog/genre-dialog.js';
import { LitElement } from '../../exports.js';
import { GenreModel, MusicModel } from '../../obscuritas-media-manager-backend-client.js';
import { renderMusicFilterStyles } from './music-filter.css.js';
import { renderMusicFilter } from './music-filter.html.js';

export class MusicFilter extends LitElement {
    static get styles() {
        return renderMusicFilterStyles();
    }

    static get properties() {
        return {
            filter: { type: Object, reflect: true },
            sortingProperty: { type: String, reflect: true },
            sortingDirection: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        SortingDirections;
        /** @type {MusicFilterOptions} */ this.filter = new MusicFilterOptions();
        /** @type { import('../../data/music-sorting-properties.js').SortingProperties }  */ this.sortingProperty = 'unset';
        /** @type {keyof SortingDirections}  */ this.sortingDirection = 'ascending';
        /** @type {Subscription[]} */ this.subscriptions = [];

        if (
            !Object.keys(MusicSortingProperties).every((property) =>
                Object.keys(new MusicModel()).concat(['unset']).includes(property)
            )
        ) {
            var missingProperties = Object.keys(MusicSortingProperties).filter((property) =>
                Object.keys(new MusicModel()).concat(['unset'])
            );
            alert("mismatch in sorting properties, the object might've changed:" + missingProperties);
            throw new Error("mismatch in sorting properties, the object might've changed" + missingProperties);
        }
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
        state;
        if (filter == 'search') {
            this.filter[filter] = state;
        } else if (filter == 'complete') this.filter.complete = state;
        else this.filter[filter].states[enumKey] = state;

        this.requestUpdate(undefined);
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    /**
     * @param {keyof MusicFilterOptions} filter
     * @param {CheckboxState} value
     */
    setArrayFilter(filter, value) {
        if (filter == 'search') this.filter[filter] = '';
        else if (filter == 'complete') this.filter.complete = value;
        else {
            for (var key in this.filter[filter].states) this.filter[filter].states[key] = value;
        }
        this.requestUpdate(undefined);
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    resetAllFilters() {
        this.filter = new MusicFilterOptions();
        this.sortingDirection = 'ascending';
        this.sortingProperty = 'unset';
        this.requestUpdate(undefined);
        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
        this.dispatchEvent(
            new CustomEvent('sortingUpdated', {
                detail: {
                    property: this.sortingProperty,
                    direction: this.sortingDirection,
                },
            })
        );
    }

    /**
     * @param {keyof MusicFilterOptions} filter
     * @param {string[]} selectedValues
     */
    handleDropdownChange(filter, selectedValues) {
        if (filter == 'search' || filter == 'complete') return;
        Object.keys(this.filter[filter].states).forEach((key) => {
            this.toggleFilter(filter, key, selectedValues.includes(key) ? CheckboxState.Ignore : CheckboxState.Forbid);
        });
    }

    async showInstrumentFilterPopup() {
        var instruments = session.instruments
            .current()
            .map((item, index) => new GenreModel({ id: `${index}`, name: item.name, section: item.type }));
        /** @type {GenreModel[]} */ var allowedInstruments = [];
        /** @type {GenreModel[]} */ var forbiddenInstruments = [];

        for (var key of Object.keys(this.filter.instruments.states)) {
            if (this.filter.instruments.states[key] == CheckboxState.Allow)
                allowedInstruments.push(instruments.find((x) => x.name == key));
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

    /**
     * @param {import('../../data/music-sorting-properties.js').SortingProperties} property
     * @param {keyof SortingDirections} direction
     */
    changeSorting(property = null, direction = null) {
        if (!property && !direction) console.log(property, direction);
        if (property) this.sortingProperty = property;
        if (direction) this.sortingDirection = direction;
        this.requestUpdate(undefined);
        this.dispatchEvent(
            new CustomEvent('sortingUpdated', {
                detail: {
                    property: this.sortingProperty,
                    direction: this.sortingDirection,
                },
            })
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
    }
}

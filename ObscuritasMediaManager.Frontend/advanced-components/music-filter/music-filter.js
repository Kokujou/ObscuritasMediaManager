import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { MusicFilterOptions } from '../../data/music-filter-options.js';
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
    }

    render() {
        return renderMusicFilter(this);
    }

    /**
     * @param {keyof MusicFilterOptions} filter
     * @param {string} value
     * @param {CheckboxState} state
     */
    toggleFilter(filter, value, state) {
        if (filter == 'title') {
            this.filter[filter] = state;
            return;
        }
        this.filter[filter].states[value] = state;

        this.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter: this.filter } }));
    }

    /**
     * @param {keyof MusicFilterOptions} filter
     * @param {string} value
     * @param {string[]} selectedValues
     */
    handleDropdownChange(filter, value, selectedValues) {
        if (filter == 'title') return;
        Object.keys(this.filter[filter].states).forEach((key) => {
            this.toggleFilter(filter, key, selectedValues.includes(key) ? CheckboxState.Allow : CheckboxState.Forbid);
        });
    }
}

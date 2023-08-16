import { LitElementBase } from '../../data/lit-element-base.js';
import { renderDropDownStyles } from './drop-down.css.js';
import { renderDropDown } from './drop-down.html.js';

/** @enum {string} */
export const DropDownStyles = { simple: 'simple', solid: 'solid', compact: 'compact' };

export class DropDown extends LitElementBase {
    static defaultstyle = DropDownStyles.simple;

    clickedOnElement = false;

    set value(value) {
        if (this.multiselect && this.values.includes(value)) {
            this.values = this.values.filter((x) => x != value);
        } else if (this.multiselect) {
            this.values.push(value);
        }

        this._currentIndex = value;
        this.dispatchEvent(
            new CustomEvent('selectionChange', { detail: { value: this.multiselect ? this.values : this.value } })
        );
        this.dispatchEvent(new Event('change'));
        this.requestUpdate(undefined);
    }

    get caption() {
        if (!this.multiselect) return this.value;
        else if (this.values.length == 0) return 'Keine Einträge ausgewählt';
        else return this.values.join(', ');
    }

    get value() {
        return this._currentIndex;
    }

    get filteredOptions() {
        if (!this.useSearch) return this.options;

        return this.options.filter((x) => x.toLocaleLowerCase().match(this.searchFilter.toLocaleLowerCase()));
    }

    checkValidity() {
        return true;
    }

    static get styles() {
        return renderDropDownStyles();
    }

    static get properties() {
        return {
            options: { type: Array, reflect: true },
            value: { type: String, reflect: true },
            maxDisplayDepth: { type: Number, reflect: true },
            required: { type: Boolean, reflect: true },
            colors: { type: Object, reflect: true },
            showDropDown: { type: Boolean, reflect: false },
            useSearch: { type: Boolean, reflect: false },
            multiselect: { type: Boolean, reflect: false },
        };
    }

    constructor() {
        super();
        this.maxDisplayDepth = 5;
        /** @type {string[]} */ this.options = [];
        this._currentIndex = '';
        this.required = false;
        this.useSearch = false;
        this.multiselect = false;
        this.searchFilter = '';
        /** @type {string[]} */ this.values = [];
        /** @type {Object.<string,string>} */ this.colors = {};

        this.addEventListener('click', () => {
            this.clickedOnElement = true;
        });

        document.addEventListener('click', () => {
            if (!this.clickedOnElement) this.showDropDown = false;
            else this.clickedOnElement = false;
        });
    }

    render() {
        return renderDropDown(this);
    }

    scroll(event) {
        event.preventDefault();
    }

    updateSearchFilter() {
        /** @type {HTMLInputElement} */ var searchBox = this.shadowRoot.querySelector('#dropdown-search');
        this.searchFilter = searchBox.value;
        this.requestUpdate(undefined);
    }

    resetSearchFilter() {
        /** @type {HTMLInputElement} */ var searchBox = this.shadowRoot.querySelector('#dropdown-search');
        this.searchFilter = '';
        searchBox.value = '';
        this.requestUpdate(undefined);
    }

    valueActive(value) {
        if (this.multiselect && this.values.includes(value)) return true;
        if (!this.multiselect && this.value == value) return true;
        return false;
    }
}

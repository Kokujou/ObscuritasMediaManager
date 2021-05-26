import { css, LitElement } from '../../exports.js';
import { renderCompactDropDownStyles } from './drop-down.css.compact.js';
import { renderDropDownStyles } from './drop-down.css.js';
import { renderSimpleDropDownStyles } from './drop-down.css.simple.js';
import { renderSolidDropDownStyles } from './drop-down.css.solid.js';
import { renderDropDown } from './drop-down.html.js';

/** @enum {string} */
export const DropDownStyles = { simple: 'simple', solid: 'solid', compact: 'compact' };

export class DropDown extends LitElement {
    static defaultstyle = DropDownStyles.simple;

    clickedOnElement = false;

    set value(value) {
        var oldValue = this._currentIndex;
        this._currentIndex = value;
        var selectionChangeEvent = new CustomEvent('selectionChange', {
            detail: { value: this.value },
        });
        this.dispatchEvent(selectionChangeEvent);
        this.dispatchEvent(new Event('change'));
        this.requestUpdate('value', oldValue);
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
        return css`
            ${renderDropDownStyles()}
            ${renderSimpleDropDownStyles()} 
            ${renderSolidDropDownStyles()}
            ${renderCompactDropDownStyles()}
        `;
    }

    static get properties() {
        return {
            options: { type: Array, reflect: true },
            value: { type: String, reflect: true },
            maxDisplayDepth: { type: Number, reflect: true },
            displayStyle: { type: String, reflect: true },
            required: { type: Boolean, reflect: true },
            showDropDown: { type: Boolean, reflect: false },
            useSearch: { type: Boolean, reflect: false },
        };
    }

    constructor() {
        super();
        this.maxDisplayDepth = 5;
        /** @type {string[]} */ this.options = [];
        this._currentIndex = '';
        this.displayStyle = DropDown.defaultstyle;
        this.required = false;
        this.useSearch = false;
        this.searchFilter = '';

        this.addEventListener('click', () => {
            this.clickedOnElement = true;
        });

        document.addEventListener('click', () => {
            if (!this.clickedOnElement) this.showDropDown = false;
            else this.clickedOnElement = false;
        });
    }

    get currentStyle() {
        var selectedStyle = Object.values(DropDownStyles).find((x) => x == this.displayStyle);
        if (!selectedStyle) {
            console.warn(
                `selected style ${this.displayStyle} is not supported. supported styles are ${Object.values(DropDownStyles)}. 
                Fallback to default style ${DropDown.defaultstyle}`
            );
            return DropDown.defaultstyle;
        }
        return selectedStyle;
    }

    render() {
        Object.values(DropDownStyles).forEach((x) => this.classList.remove(x));
        this.classList.add(this.currentStyle);

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
}

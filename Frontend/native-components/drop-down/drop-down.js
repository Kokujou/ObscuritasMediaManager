import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { DropDownOption } from './drop-down-option.js';
import { renderDropDownStyles } from './drop-down.css.js';
import { renderDropDown } from './drop-down.html.js';

/** @enum {string} */
export const DropDownStyles = { simple: 'simple', solid: 'solid', compact: 'compact' };

export class DropDown extends LitElementBase {
    static defaultstyle = DropDownStyles.simple;

    clickedOnElement = false;

    static get styles() {
        return renderDropDownStyles();
    }

    static get properties() {
        return {
            options: { type: Array, reflect: true },
            unsetText: { type: String, reflect: true },
            maxDisplayDepth: { type: Number, reflect: true },
            required: { type: Boolean, reflect: true },
            threeValues: { type: Boolean, reflect: true },
            multiselect: { type: Boolean, reflect: true },
            useSearch: { type: Boolean, reflect: true },
            useToggle: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
            colors: { type: Object, reflect: true },
            showDropDown: { type: Boolean, reflect: false },
        };
    }

    get caption() {
        var notForbiddenOptions = this.options.filter((x) => x.state != CheckboxState.Forbid);
        if (!this.multiselect) return notForbiddenOptions[0]?.text ?? this.unsetText;
        else if (notForbiddenOptions.length == 0) return this.unsetText;
        else return notForbiddenOptions.map((x) => x.text).join(', ');
    }

    constructor() {
        super();
        this.maxDisplayDepth = 5;
        this._currentIndex = 0;
        this.unsetText = 'Unset';
        this.required = false;
        this.useSearch = false;
        this.useToggle = false;
        this.multiselect = false;
        this.threeValues = false;
        this.searchFilter = '';
        /** @type {DropDownOption[]} */ this.options = [];
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
        this.requestFullUpdate();
    }

    resetSearchFilter() {
        /** @type {HTMLInputElement} */ var searchBox = this.shadowRoot.querySelector('#dropdown-search');
        this.searchFilter = '';
        searchBox.value = '';
        this.requestFullUpdate();
    }

    /**
     *
     * @param {DropDownOption} option
     * @param {CheckboxState} state
     */
    changeOptionState(option, state) {
        if (state != CheckboxState.Forbid && !this.multiselect) for (let o of this.options) o.state = CheckboxState.Forbid;
        option.state = state;

        this.dispatchEvent(new CustomEvent('selectionChange', { detail: { option } }));
        this.dispatchEvent(new Event('change'));
        this.requestFullUpdate();
    }
}

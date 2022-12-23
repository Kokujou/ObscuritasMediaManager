import { LitElementBase } from '../../data/lit-element-base.js';
import { renderGroupedDropdownStyles } from './grouped-dropdown.css.js';
import { renderGroupedDropdown } from './grouped-dropdown.html.js';

/** @typedef { Object.<string, string[]> } DropdownCategories */
/** @typedef { {value:string, category: keyof DropdownCategories} } GroupedDropdownResult */

export class GroupedDropdown extends LitElementBase {
    static get styles() {
        return renderGroupedDropdownStyles();
    }

    static get properties() {
        return {
            options: { type: Object, reflect: true },
            result: { type: Object, reflect: true },
            maxDisplayDepth: { type: Number, reflect: true },

            showDropDown: { type: Boolean, reflect: false },
        };
    }

    get results() {
        return Object.entries(this.options)
            .map((x) => x[1].map((y) => /** @type {GroupedDropdownResult} */ ({ category: x[0], value: y })))
            .flatMap((x) => x);
    }

    /** @type {GroupedDropdownResult} */
    get result() {
        return this._result;
    }

    /**
     * @param {GroupedDropdownResult} value
     */
    set result(value) {
        this._result = value;
        this.dispatchCustomEvent('selectionChange', this._result);
        this.requestUpdate(undefined);
    }

    constructor() {
        super();

        /** @type {DropdownCategories} */ this.options;
        /** @type {boolean} */ this.showDropDown;
        /** @type {number} */ this.maxDisplayDepth = 5;
        this._result = /** @type {GroupedDropdownResult} */ ({ category: null, value: null });
    }

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener('keydown', (e) => {
            if (e.key != 'ArrowUp' && e.key != 'ArrowDown') return;

            e.preventDefault();
            e.stopPropagation();

            var index = this.results.findIndex((x) => x.value == this.result.value);

            if (e.key == 'ArrowUp') index--;
            else if (e.key == 'ArrowDown') index++;

            if (index < 0) index = this.results.length - 1;
            if (index >= this.results.length) index = 0;

            this.result = this.results[index];
        });
    }

    render() {
        return renderGroupedDropdown(this);
    }
}

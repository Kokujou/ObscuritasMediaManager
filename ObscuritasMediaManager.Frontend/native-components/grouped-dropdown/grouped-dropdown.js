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

    get result() {
        return this._result;
    }

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
        /** @type {GroupedDropdownResult} */ this._result = {};
    }

    render() {
        return renderGroupedDropdown(this);
    }
}

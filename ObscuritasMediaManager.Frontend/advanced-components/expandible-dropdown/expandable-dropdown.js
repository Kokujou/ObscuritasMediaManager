import { LitElement } from '../../exports.js';
import { renderExpandableDropdownStyles } from './expandable-dropdown.css.js';
import { renderExpandableDropdown } from './expandable-dropdown.html.js';

export class ExpandableDropdown extends LitElement {
    static get styles() {
        return renderExpandableDropdownStyles();
    }

    /**
     * @param {HTMLElement} element
     */
    static switchActiveClass(element) {
        console.log(element);
        // @ts-ignore
        if (element.classList.replace('active', 'inactive')) return;
        element.classList.replace('inactive', 'active');
    }

    static get properties() {
        return {
            caption: { type: String, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.caption;
        /** @type {boolean} */ this.disabled;
    }

    render() {
        return renderExpandableDropdown(this);
    }
}

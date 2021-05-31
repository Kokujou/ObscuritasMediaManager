import { LitElement } from '../../exports.js';
import { renderScrollSelectStyles } from './scroll-select.css.js';
import { renderScrollSelect } from './scroll-select.html.js';

export class ScrollSelect extends LitElement {
    static get styles() {
        return renderScrollSelectStyles();
    }

    static get properties() {
        return {
            options: { type: Array, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string[]} */ this.options;
    }

    render() {
        return renderScrollSelect(this);
    }
}

import { LitElement } from '../../exports.js';
import { renderPartialLoading } from './partial-loading.html.js';

export class PartialLoading extends LitElement {
    static get properties() {
        return {
            hideText: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {boolean} */ this.hideText;
    }

    render() {
        return renderPartialLoading();
    }
}

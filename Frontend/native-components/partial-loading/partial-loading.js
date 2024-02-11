import { LitElementBase } from '../../data/lit-element-base.js';
import { renderPartialLoading } from './partial-loading.html.js';

export class PartialLoading extends LitElementBase {
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

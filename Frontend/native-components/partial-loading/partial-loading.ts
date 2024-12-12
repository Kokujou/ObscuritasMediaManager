import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderPartialLoading } from './partial-loading.html';

@customElement('partial-loading')
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

    override render() {
        return renderPartialLoading();
    }
}

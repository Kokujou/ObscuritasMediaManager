import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderBorderButtonStyles } from './border-button.css';
import { renderBorderButton } from './border-button.html';

@customElement('border-button')
export class BorderButton extends LitElementBase {
    static override get styles() {
        return renderBorderButtonStyles();
    }

    static get properties() {
        return {
            text: { type: String, reflect: true },
            disabled: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.text;
    }

    override render() {
        return renderBorderButton(this);
    }
}

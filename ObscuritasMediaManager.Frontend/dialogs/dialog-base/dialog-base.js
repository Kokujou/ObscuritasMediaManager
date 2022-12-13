import { LitElementBase } from '../../data/lit-element-base.js';
import { renderDialogBaseStyles } from './dialog-base.css.js';
import { renderDialogBase } from './dialog-base.html.js';

export class DialogBase extends LitElementBase {
    static get styles() {
        return renderDialogBaseStyles();
    }

    static get properties() {
        return {
            caption: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.caption;
        window.addEventListener('keyup', (e) => {
            if (e.key == 'Escape') this.decline();
        });
    }

    render() {
        return renderDialogBase(this);
    }

    accept() {
        this.dispatchCustomEvent('accept');
    }

    decline() {
        this.dispatchCustomEvent('decline');
    }
}

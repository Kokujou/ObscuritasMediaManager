import { LitElement } from '../../exports.js';
import { renderTagLabelStyles } from './tag-label.css.js';
import { renderTagLabel } from './tag-label.html.js';

export class TagLabel extends LitElement {
    static get styles() {
        return renderTagLabelStyles();
    }

    static get properties() {
        return {
            text: { type: String, reflect: true },
            createNew: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.text;
        /** @type {boolean} */ this.createNew = false;
    }

    render() {
        return renderTagLabel(this);
    }

    notifyRemoved() {
        var removedEvent = new CustomEvent('removed');
        this.dispatchEvent(removedEvent);
    }

    notifyTagCreated() {
        /** @type {HTMLInputElement} */ var tagInput = this.shadowRoot.querySelector('#new-tag-input');
        this.dispatchEvent(new CustomEvent('tagCreated', { detail: { value: tagInput.value } }));
    }
}

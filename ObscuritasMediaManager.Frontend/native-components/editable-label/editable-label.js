import { LitElement } from '../../exports.js';
import { renderEditableLabelStyles } from './editable-label.css.js';
import { renderEditableLabel } from './editable-label.html.js';

export class EditableLabel extends LitElement {
    static get styles() {
        return renderEditableLabelStyles();
    }

    static get properties() {
        return {
            value: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {string} */ this.value;
        /** @type {boolean} */ this.editEnabled;
    }

    render() {
        return renderEditableLabel(this);
    }

    enableEditing() {
        this.editEnabled = true;
        this.requestUpdate(undefined);
    }

    /**
     * @param {KeyboardEvent} e
     */
    handleLabelInput(e) {
        if (e.key == 'Enter') this.saveChanges();
        else if (e.key == 'Escape') this.revertChanges();
        else return;

        e.stopPropagation();
        e.preventDefault();
    }

    revertChanges() {
        /** @type {HTMLLabelElement} */ var input = this.shadowRoot.querySelector('#value-input');
        input.innerText = this.value;
        this.editEnabled = false;
        this.requestUpdate(undefined);
    }

    saveChanges() {
        /** @type {HTMLLabelElement} */ var input = this.shadowRoot.querySelector('#value-input');
        this.value = input.innerText;
        this.dispatchEvent(new CustomEvent('valueChanged', { detail: { value: this.value } }));
        this.editEnabled = false;
        this.requestUpdate(undefined);
    }
}

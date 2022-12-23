import { LitElementBase } from '../../data/lit-element-base.js';
import { renderEditableLabelStyles } from './editable-label.css.js';
import { renderEditableLabel } from './editable-label.html.js';

export class EditableLabel extends LitElementBase {
    static get styles() {
        return renderEditableLabelStyles();
    }

    static get properties() {
        return {
            value: { type: String, reflect: true },
            editEnabled: { type: Boolean, reflect: true },
            supportedCharacters: { type: String, reflect: true },
        };
    }

    get inputField() {
        return (this._inputField ??= this.shadowRoot.querySelector('input'));
    }

    constructor() {
        super();
        /** @type {string} */ this.value;
        /** @type {boolean} */ this.editEnabled;
        /** @type {string} */ this.supportedCharacters = null;

        this._inputField = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('focusin', () => {
            document.execCommand('selectAll');
        });
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
        else if (this.supportedCharacters && e.key.length == 1 && !e.key.match(new RegExp(this.supportedCharacters, 'g')))
            console.warn('unsupported character: ' + e.key);
        else return;

        if (e.code) e.stopPropagation();
        e.preventDefault();
    }

    revertChanges() {
        this.inputField.value = this.value;
        this.editEnabled = false;
        this.requestUpdate(undefined);
    }

    saveChanges() {
        this.value = this.inputField.value;
        this.dispatchCustomEvent('valueChanged', { value: this.value });
        this.dispatchEvent(
            new KeyboardEvent('keydown', { bubbles: true, composed: true, cancelable: true, key: 'Tab', code: 'Tab', keyCode: 9 })
        );

        this.editEnabled = false;
        this.requestUpdate(undefined);
    }

    /**
     * @param {ClipboardEvent} event
     */
    handlePaste(event) {
        event.preventDefault();
        var text = event.clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
    }

    /**
     *
     * @param {FocusOptions} options
     */
    focus(options) {
        super.focus(options);
        this.inputField.focus(options);
    }
}

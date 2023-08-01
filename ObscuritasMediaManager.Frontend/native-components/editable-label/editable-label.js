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

    /** @type {HTMLDivElement} */
    get inputField() {
        return (this._inputField ??= this.shadowRoot.querySelector('#value-input'));
    }

    constructor() {
        super();
        /** @type {string} */ this.value;
        /** @type {boolean} */ this.editEnabled = false;
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

    /**
     * @param {KeyboardEvent} e
     */
    handleLabelInput(e) {
        if (e.ctrlKey) return;
        else if (this.supportedCharacters && e.key.length == 1 && !e.key.match(new RegExp(this.supportedCharacters, 'g')))
            console.warn('unsupported character: ' + e.key);
        else return;

        if (e.code) e.stopPropagation();
        e.preventDefault();
    }

    /**
     * @param {ClipboardEvent} event
     */
    handlePaste(event) {
        event.preventDefault();
        var text = event.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
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

import { LitElementBase } from '../../data/lit-element-base.js';
import { renderTagLabelStyles } from './tag-label.css.js';
import { renderTagLabel } from './tag-label.html.js';

export class TagLabel extends LitElementBase {
    static get styles() {
        return renderTagLabelStyles();
    }

    static get properties() {
        return {
            text: { type: String, reflect: true },
            createNew: { type: Boolean, reflect: true },
            autocomplete: { type: Array, reflect: true },
            disabled: { type: Boolean, reflect: true },
            showAutocomplete: { type: Boolean, reflect: false },
        };
    }

    get selectedElement() {
        /** @type {NodeListOf<HTMLElement>} */ var elements = this.shadowRoot.querySelectorAll(
            '#autocomplete-list .autocomplete-item'
        );
        if (elements[this.autofillIndex]) return elements[this.autofillIndex];
        return null;
    }

    get autocompleteItems() {
        /** @type {HTMLInputElement} */ var input = this.shadowRoot.querySelector('#new-tag-input');
        if (!input) return [];
        var searchText = input.value;
        return this.autocomplete.filter((x) => x.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    }

    constructor() {
        super();
        /** @type {string} */ this.text;
        /** @type {boolean} */ this.createNew = false;
        /** @type {boolean} */ this.disabled = false;
        /** @type {string[]} */ this.autocomplete = [];
        /** @type {number} */ this.autofillIndex = -1;
        /** @type {boolean} */ this.showAutocomplete = false;
    }

    render() {
        return renderTagLabel(this);
    }

    /**
     * @param {Event} e
     */
    notifyRemoved(e) {
        this.dispatchEvent(new CustomEvent('removed'));
    }

    notifyTagCreated() {
        /** @type {HTMLInputElement} */ var tagInput = this.shadowRoot.querySelector('#new-tag-input');
        this.dispatchEvent(new CustomEvent('tagCreated', { detail: { value: tagInput.value } }));
    }

    /**@param {KeyboardEvent} event */
    handleInput(event) {
        if (event.key == 'ArrowDown') {
            this.autofillIndex++;
            if (this.autofillIndex >= this.autocompleteItems.length) this.autofillIndex = 0;
            var selectedElement = this.selectedElement;
            if (!selectedElement) return;
            if (selectedElement.offsetTop >= selectedElement.parentElement.offsetHeight + selectedElement.parentElement.scrollTop)
                selectedElement.parentElement.scrollTo({
                    top: selectedElement.offsetTop + selectedElement.offsetHeight - selectedElement.parentElement.offsetHeight,
                });
        } else if (event.key == 'ArrowUp') {
            if (this.autofillIndex <= 0) this.autofillIndex = this.autocompleteItems.length;
            this.autofillIndex--;
            var selectedElement = this.selectedElement;
            if (!selectedElement) return;
            if (selectedElement.offsetTop <= selectedElement.parentElement.scrollTop)
                selectedElement.parentElement.scrollTo({ top: selectedElement.offsetTop });
        } else if (event.key == 'Enter' || event.key == 'Tab')
            this.setSearchText(this.autocompleteItems[this.autofillIndex > 0 ? this.autofillIndex : 0]);

        this.requestFullUpdate();
        var selectedElement = this.selectedElement;
        if (!selectedElement) return;
        if (selectedElement.offsetTop == 0) selectedElement.parentElement.scrollTo({ top: 0 });
        if (selectedElement.offsetTop + selectedElement.offsetHeight == selectedElement.parentElement.scrollHeight)
            selectedElement.parentElement.scrollTo({ top: selectedElement.parentElement.scrollHeight });
    }

    setSearchText(text) {
        /** @type {HTMLInputElement} */ var input = this.shadowRoot.querySelector('#new-tag-input');
        input.value = text;
        this.requestFullUpdate();
        this.notifyTagCreated();
        input.value = '';
    }
}

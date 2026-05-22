import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { TagAutocompleteItem } from './tag-autocomplete-item';
import { renderTagLabelStyles } from './tag-label.css';
import { renderTagLabel } from './tag-label.html';

@customElement('tag-label')
export class TagLabel extends LitElementBase {
    static override get styles() {
        return renderTagLabelStyles();
    }

    get selectedElement() {
        var elements = this.shadowRoot!.querySelectorAll('#autocomplete-list .autocomplete-item') as NodeListOf<HTMLElement>;
        if (elements[this.autofillIndex]) return elements[this.autofillIndex];
        return null;
    }

    get filteredAutocomplete() {
        var input = this.shadowRoot!.querySelector('#new-tag-input') as HTMLInputElement;
        if (!input) return [];
        var searchText = input.value;
        return this.autocomplete.filter((x) => {
            const text = typeof x === 'string' ? x : x.text;
            return text.toLocaleLowerCase().includes(searchText.toLocaleLowerCase());
        });
    }

    @property() declare public text: string;
    @property({ reflect: true }) declare public group?: string;
    @property({ type: Boolean, reflect: true }) declare public createNew: boolean;
    @property({ type: Boolean, reflect: true }) declare public disabled: boolean;
    @property({ type: Array }) declare public autocomplete: string[] | TagAutocompleteItem[];
    @property() declare public placeholder?: string;

    @state() declare protected autofillIndex: number;
    @state() declare protected showAutocomplete: boolean;

    constructor() {
        super();
        this.autocomplete = [];
    }

    override render() {
        return renderTagLabel.call(this);
    }

    notifyRemoved(e: Event) {
        this.dispatchEvent(new CustomEvent('removed'));
        this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
    }

    handleInput(event: KeyboardEvent) {
        if (event.key == 'ArrowDown') {
            this.autofillIndex++;
            if (this.autofillIndex >= this.filteredAutocomplete.length) this.autofillIndex = 0;
            var selectedElement = this.selectedElement;
            if (!selectedElement) return;
            var selectedParent = selectedElement.parentElement!;
            if (selectedElement.offsetTop >= selectedParent.offsetHeight + selectedParent.scrollTop)
                selectedParent.scrollTo({
                    top: selectedElement.offsetTop + selectedElement.offsetHeight - selectedParent.offsetHeight,
                });
        } else if (event.key == 'ArrowUp') {
            if (this.autofillIndex <= 0) this.autofillIndex = this.filteredAutocomplete.length;
            this.autofillIndex--;
            var selectedElement = this.selectedElement;
            if (!selectedElement) return;
            var selectedParent = selectedElement.parentElement!;
            if (selectedElement.offsetTop <= selectedParent.scrollTop)
                selectedParent.scrollTo({ top: selectedElement.offsetTop });
        } else if (event.key == 'Enter' || event.key == 'Tab')
            this.notifyTagCreated(this.filteredAutocomplete[this.autofillIndex > 0 ? this.autofillIndex : 0]);

        this.requestFullUpdate();
        var selectedElement = this.selectedElement;
        if (!selectedElement) return;
        var selectedParent = selectedElement.parentElement!;
        if (selectedElement.offsetTop == 0) selectedParent.scrollTo({ top: 0 });
        if (selectedElement.offsetTop + selectedElement.offsetHeight == selectedParent.scrollHeight)
            selectedParent.scrollTo({ top: selectedParent.scrollHeight });
    }

    notifyTagCreated(item: string | TagAutocompleteItem) {
        var tagInput = this.shadowRoot!.querySelector('#new-tag-input') as HTMLInputElement;
        this.dispatchEvent(new CustomEvent('tagCreated', { detail: { value: item } }));
        tagInput.value = '';
        this.requestFullUpdate();
    }
}

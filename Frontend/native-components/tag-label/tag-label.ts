import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
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

    get autocompleteItems() {
        var input = this.shadowRoot!.querySelector('#new-tag-input') as HTMLInputElement;
        if (!input) return [];
        var searchText = input.value;
        return this.autocomplete.filter((x) => x.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()));
    }

    @property() public declare text: string;
    @property({ type: Boolean, reflect: true }) public declare createNew: boolean;
    @property({ type: Boolean, reflect: true }) public declare disabled: boolean;
    @property({ type: Array }) public declare autocomplete: string[];

    @state() protected declare autofillIndex: number;
    @state() protected declare showAutocomplete: boolean;

    constructor() {
        super();
        this.autocomplete = [];
    }

    override render() {
        return renderTagLabel.call(this);
    }

    notifyRemoved(e: Event) {
        this.dispatchEvent(new CustomEvent('removed'));
    }

    notifyTagCreated() {
        var tagInput = this.shadowRoot!.querySelector('#new-tag-input') as HTMLInputElement;
        this.dispatchEvent(new CustomEvent('tagCreated', { detail: { value: tagInput.value } }));
    }

    handleInput(event: KeyboardEvent) {
        if (event.key == 'ArrowDown') {
            this.autofillIndex++;
            if (this.autofillIndex >= this.autocompleteItems.length) this.autofillIndex = 0;
            var selectedElement = this.selectedElement;
            if (!selectedElement) return;
            var selectedParent = selectedElement.parentElement!;
            if (selectedElement.offsetTop >= selectedParent.offsetHeight + selectedParent.scrollTop)
                selectedParent.scrollTo({
                    top: selectedElement.offsetTop + selectedElement.offsetHeight - selectedParent.offsetHeight,
                });
        } else if (event.key == 'ArrowUp') {
            if (this.autofillIndex <= 0) this.autofillIndex = this.autocompleteItems.length;
            this.autofillIndex--;
            var selectedElement = this.selectedElement;
            if (!selectedElement) return;
            var selectedParent = selectedElement.parentElement!;
            if (selectedElement.offsetTop <= selectedParent.scrollTop)
                selectedParent.scrollTo({ top: selectedElement.offsetTop });
        } else if (event.key == 'Enter' || event.key == 'Tab')
            this.setSearchText(this.autocompleteItems[this.autofillIndex > 0 ? this.autofillIndex : 0]);

        this.requestFullUpdate();
        var selectedElement = this.selectedElement;
        if (!selectedElement) return;
        var selectedParent = selectedElement.parentElement!;
        if (selectedElement.offsetTop == 0) selectedParent.scrollTo({ top: 0 });
        if (selectedElement.offsetTop + selectedElement.offsetHeight == selectedParent.scrollHeight)
            selectedParent.scrollTo({ top: selectedParent.scrollHeight });
    }

    setSearchText(text: string) {
        var input = this.shadowRoot!.querySelector('#new-tag-input') as HTMLInputElement;
        input.value = text;
        this.requestFullUpdate();
        this.notifyTagCreated();
        input.value = '';
    }
}

import { customElement, property, query, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderAutocompleteInputStyles } from './autocomplete-input.css';
import { renderAutocompleteInput } from './autocomplete-input.html';

export type AutocompleteItem = { text: string; id: string | null };

@customElement('autocomplete-input')
export class AutocompleteInput extends LitElementBase {
    static override get styles() {
        return renderAutocompleteInputStyles();
    }

    @property() declare public searchItems?: (text: string) => Promise<AutocompleteItem[]>;
    @property() declare public placeholder?: string;
    @property({ type: Object }) declare public value?: AutocompleteItem;
    @property({ type: Boolean }) declare public allowText: boolean;

    @state() declare protected showDropdown: boolean;
    @state() declare protected searchResult: AutocompleteItem[] | undefined;
    @state() declare protected focusedItem: AutocompleteItem | null;

    @query('#search-field') declare public searchField: HTMLInputElement;

    connectedCallback() {
        super.connectedCallback();

        this.onblur = () => this.selectItem(this.value);
    }

    override render() {
        return renderAutocompleteInput.call(this);
    }

    async handleInput(event: Event) {
        var searchText = (event.target as HTMLInputElement).value;

        if (searchText.length < 3) {
            this.showDropdown = false;
            return;
        }

        if (this.searchItems) this.searchResult = await this.searchItems((event.target as HTMLInputElement).value);
        if (this.searchResult?.length) this.showDropdown = true;
    }

    handleKey(event: KeyboardEvent) {
        if (event.key == 'Escape' || event.key == 'Tab') {
            event.stopPropagation();
            this.selectItem(this.value);
            return;
        }

        if (event.key == 'Enter' && this.showDropdown) {
            event.stopPropagation();
            this.selectItem(this.focusedItem);
            return;
        }

        if (event.key == 'ArrowUp' && this.searchResult) {
            event.preventDefault();
            if (this.focusedItem)
                this.focusedItem =
                    this.searchResult[
                        this.searchResult.indexOf(this.focusedItem) <= 0
                            ? this.searchResult.length - 1
                            : this.searchResult.indexOf(this.focusedItem) - 1
                    ];
            this.focusedItem ??= this.searchResult[0];
            return;
        }

        if (event.key == 'ArrowDown' && this.searchResult) {
            event.preventDefault();
            if (this.focusedItem) this.focusedItem = this.searchResult[this.searchResult.indexOf(this.focusedItem) + 1];
            this.focusedItem ??= this.searchResult[0];
            return;
        }
    }

    selectItem(item: AutocompleteItem | undefined | null) {
        if (this.searchField.value != this.value?.text && this.value?.id == item?.id && !this.allowText) {
            this.searchField.value = this.value?.text ?? '';
            this.showDropdown = false;
            return;
        }

        if (!item?.id && !this.allowText) return;
        if (!item?.id) item = { id: null, text: this.searchField.value };
        if (item.text == this.value?.text) return;
        this.value = item;

        this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: this.value }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        this.showDropdown = false;
        this.searchField.value = this.value?.text ?? '';
    }
}

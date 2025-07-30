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

    @property() public declare searchItems?: (text: string) => Promise<AutocompleteItem[]>;
    @property() public declare placeholder?: string;
    @property({ type: Object }) public declare value?: AutocompleteItem;
    @property({ type: Boolean }) public declare allowText: boolean;

    @state() protected declare showDropdown: boolean;
    @state() protected declare searchResult: AutocompleteItem[] | undefined;
    @state() protected declare focusedItem: AutocompleteItem | null;

    @query('#search-field') public declare searchField: HTMLInputElement;

    connectedCallback() {
        super.connectedCallback();

        this.onblur = () => this.selectItem(this.value);
        this.tabIndex = 0;
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

    handleKeyDown(event: KeyboardEvent) {
        if (event.key == 'Escape' || event.key == 'Tab') {
            this.selectItem(this.value);
            return;
        }

        if (event.key == 'Enter' && this.showDropdown) {
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
        if (!item?.id && !this.allowText) return;
        if (!item?.id) item = { id: null, text: this.searchField.value };
        console.log(item);
        this.value = item;

        this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: this.value }));
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        this.showDropdown = false;
        this.searchField.value = this.value?.text ?? '';
    }
}

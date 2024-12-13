import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderGroupedDropdownStyles } from './grouped-dropdown.css';
import { renderGroupedDropdown } from './grouped-dropdown.html';

export type DropdownCategories = { [key: string]: string[] };
export type GroupedDropdownResult = { value: string | null; category: keyof DropdownCategories | null };

@customElement('grouped-dropdown')
export class GroupedDropdown extends LitElementBase {
    static override get styles() {
        return renderGroupedDropdownStyles();
    }

    get results() {
        return Object.entries(this.options)
            .map((x) => x[1].map((y: any) => ({ category: x[0], value: y } as GroupedDropdownResult)))
            .flatMap((x) => x);
    }

    @property({ type: Object }) options: Object;
    @property({ type: Boolean }) showDropDown: boolean;
    @property({ type: Number }) maxDisplayDepth = 5;
    @property() search = '';
    result = { category: null, value: null } as GroupedDropdownResult;
    searchResetCallback = setTimeout(() => (this.search = ''), 1000);

    override connectedCallback() {
        super.connectedCallback();

        this.addEventListener('keydown', (e) => {
            if (e.key.length == 1) {
                this.search += e.key;
                clearTimeout(this.searchResetCallback);
                this.searchResetCallback = setTimeout(() => (this.search = ''), 1000);
                this.result = this.results.find((x) => x.value.toLowerCase().startsWith(this.search.toLowerCase()));
            }

            if (e.key != 'ArrowUp' && e.key != 'ArrowDown') return;

            e.preventDefault();
            e.stopPropagation();

            var index = this.results.findIndex((x) => x.value == this.result.value);

            if (e.key == 'ArrowUp') index--;
            else if (e.key == 'ArrowDown') index++;

            if (index < 0) index = this.results.length - 1;
            if (index >= this.results.length) index = 0;

            this.result = this.results[index];
        });
    }

    updated(_changedProperties: Map<string, any>) {
        super.updated(_changedProperties);
        if (_changedProperties.has('result')) {
            this.dispatchEvent(new CustomEvent('selectionChange', { detail: this.result }));
            this.requestFullUpdate();
        }
    }

    override render() {
        return renderGroupedDropdown.call(this);
    }
}

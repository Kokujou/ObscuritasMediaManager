import { customElement, property, state } from 'lit-element/decorators';
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

    @property({ type: Object }) public declare options: Object;
    @property({ type: Number }) public declare maxDisplayDepth: number;

    @state() public declare showDropDown: boolean;
    @state() protected declare search: string;

    @state() protected declare result: GroupedDropdownResult;
    searchResetCallback = setTimeout(() => (this.search = ''), 1000);

    constructor() {
        super();
        this.maxDisplayDepth = 5;
        this.result = { category: null, value: null } as GroupedDropdownResult;
    }

    override connectedCallback() {
        super.connectedCallback();

        this.addEventListener('keydown', (e) => {
            if (e.key.length == 1) {
                this.search += e.key;
                clearTimeout(this.searchResetCallback);
                this.searchResetCallback = setTimeout(() => (this.search = ''), 1000);
                this.changeResult(this.results.find((x) => x.value.toLowerCase().startsWith(this.search.toLowerCase())));
            }

            if (e.key != 'ArrowUp' && e.key != 'ArrowDown') return;

            e.preventDefault();
            e.stopPropagation();

            var index = this.results.findIndex((x) => x.value == this.result.value);

            if (e.key == 'ArrowUp') index--;
            else if (e.key == 'ArrowDown') index++;

            if (index < 0) index = this.results.length - 1;
            if (index >= this.results.length) index = 0;

            this.changeResult(this.results[index]);
        });

        this.addEventListener('click', (e) => e.stopPropagation());

        document.addEventListener('click', () => (this.showDropDown = false));
    }

    changeResult(result: GroupedDropdownResult) {
        this.result = result;
        this.dispatchEvent(new CustomEvent('selectionChange', { detail: this.result }));
    }

    override render() {
        return renderGroupedDropdown.call(this);
    }
}

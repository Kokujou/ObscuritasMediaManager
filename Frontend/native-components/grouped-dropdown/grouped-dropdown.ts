import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderGroupedDropdownStyles } from './grouped-dropdown.css';
import { renderGroupedDropdown } from './grouped-dropdown.html';

/** @typedef { Object.<string, string[]> } DropdownCategories */
/** @typedef { {value:string, category: keyof DropdownCategories} } GroupedDropdownResult */

@customElement('grouped-dropdown')
export class GroupedDropdown extends LitElementBase {
    static override get styles() {
        return renderGroupedDropdownStyles();
    }

    static get properties() {
        return {
            options: { type: Object, reflect: true },
            result: { type: Object, reflect: true },
            maxDisplayDepth: { type: Number, reflect: true },

            showDropDown: { type: Boolean, reflect: false },
        };
    }

    get results() {
        return Object.entries(this.options)
            .map((x) => x[1].map((y) => /** @type {GroupedDropdownResult} */ ({ category: x[0], value: y })))
            .flatMap((x) => x);
    }

    constructor() {
        super();

        /** @type {DropdownCategories} */ this.options;
        /** @type {boolean} */ this.showDropDown;
        /** @type {number} */ this.maxDisplayDepth = 5;
        /** @type {string} */ this.search = '';
        this.result = /** @type {GroupedDropdownResult} */ { category: null, value: null };
    }

    override connectedCallback() {
        super.connectedCallback();

        this.searchResetCallback = setTimeout(() => (this.search = ''), 1000);
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

    /**
     * @param {Map<string,any>} _changedProperties
     */
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (_changedProperties.has('result')) {
            this.dispatchEvent(new CustomEvent('selectionChange', { detail: this.result }));
            this.requestFullUpdate();
        }
    }

    override render() {
        return renderGroupedDropdown(this);
    }
}

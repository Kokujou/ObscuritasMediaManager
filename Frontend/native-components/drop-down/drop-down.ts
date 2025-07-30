import { customElement, property, state } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { LitElementBase } from '../../data/lit-element-base';
import { DropDownOption } from './drop-down-option';
import { renderDropDownStyles } from './drop-down.css';
import { renderDropDown } from './drop-down.html';

export const DropDownStyles = { simple: 'simple', solid: 'solid', compact: 'compact' };

@customElement('drop-down')
export class DropDown extends LitElementBase {
    static defaultstyle = DropDownStyles.simple;

    clickedOnElement = false;

    static override get styles() {
        return renderDropDownStyles();
    }

    private _caption: string | undefined;

    @property()
    get caption() {
        var notForbiddenOptions = this.options.filter((x) => x.state != CheckboxState.Forbid);
        if (this._caption)
            return (
                this._caption +
                (notForbiddenOptions.length > 0 && this.multiselect ? ` (${notForbiddenOptions.length} ausgewählt)` : '')
            );

        if (!this.multiselect) return notForbiddenOptions[0]?.text ?? this.unsetText;
        else if (notForbiddenOptions.length == 0) return this.unsetText;
        else return notForbiddenOptions.map((x) => x.text).join(', ');
    }

    set caption(value: string) {
        this._caption = value;
    }

    @property() public declare unsetText: string;
    @property() public declare searchFilter: string;
    @property({ reflect: true }) public declare orientation: 'up' | 'down';
    @property({ type: Number }) public declare maxDisplayDepth: number;
    @property({ type: Number }) public declare _currentIndex: number;
    @property({ type: Boolean, reflect: true }) public declare required: boolean;
    @property({ type: Boolean, reflect: true }) public declare useSearch: boolean;
    @property({ type: Boolean, reflect: true }) public declare useToggle: boolean;
    @property({ type: Boolean, reflect: true }) public declare multiselect: boolean;
    @property({ type: Boolean, reflect: true }) public declare threeValues: boolean;
    @property({ type: Array }) public declare options: DropDownOption<any>[];

    @state() protected declare showDropDown: boolean;

    constructor() {
        super();
        this.unsetText = 'Unset';
        this.maxDisplayDepth = 5;
        this.options = [];
        this.addEventListener('click', () => {
            this.clickedOnElement = true;
        });

        document.addEventListener('click', () => {
            if (!this.clickedOnElement) this.showDropDown = false;
            else this.clickedOnElement = false;
        });
    }

    override render() {
        return renderDropDown.call(this);
    }

    updateSearchFilter() {
        var searchBox = this.shadowRoot!.querySelector('#dropdown-search') as HTMLInputElement;
        this.searchFilter = searchBox.value;
        this.requestFullUpdate();
    }

    resetSearchFilter() {
        var searchBox = this.shadowRoot!.querySelector('#dropdown-search') as HTMLInputElement;
        this.searchFilter = '';
        searchBox.value = '';
        this.requestFullUpdate();
        if (this.showDropDown) searchBox.focus();
    }

    changeOptionState(option: DropDownOption<any>, state: CheckboxState) {
        if (state != CheckboxState.Forbid && !this.multiselect) for (let o of this.options) o.state = CheckboxState.Forbid;
        option.state = state;

        this.dispatchEvent(new CustomEvent('selectionChange', { detail: { option } }));
        this.dispatchEvent(new Event('change', { composed: true, bubbles: true }));
        this.requestFullUpdate();
    }
}

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

    static get properties() {
        return {
            options: { type: Array, reflect: true },
            unsetText: { type: String, reflect: true },
            maxDisplayDepth: { type: Number, reflect: true },
            required: { type: Boolean, reflect: true },
            threeValues: { type: Boolean, reflect: true },
            multiselect: { type: Boolean, reflect: true },
            useSearch: { type: Boolean, reflect: true },
            useToggle: { type: Boolean, reflect: true },
            disabled: { type: Boolean, reflect: true },
            colors: { type: Object, reflect: true },
            showDropDown: { type: Boolean, reflect: false },
        };
    }

    get caption() {
        var notForbiddenOptions = this.options.filter((x) => x.state != CheckboxState.Forbid);
        if (!this.multiselect) return notForbiddenOptions[0]?.text ?? this.unsetText;
        else if (notForbiddenOptions.length == 0) return this.unsetText;
        else return notForbiddenOptions.map((x) => x.text).join(', ');
    }

    @property() maxDisplayDepth = 5;
    @property() _currentIndex = 0;
    @property() unsetText = 'Unset';
    @property() required = false;
    @property() useSearch = false;
    @property() useToggle = false;
    @property() multiselect = false;
    @property() threeValues = false;
    @property() searchFilter = '';
    @property({ type: Array }) options: DropDownOption<any>[] = [];

    @state() showDropDown = false;

    constructor() {
        super();
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
    }

    changeOptionState(option: DropDownOption<any>, state: CheckboxState) {
        if (state != CheckboxState.Forbid && !this.multiselect) for (let o of this.options) o.state = CheckboxState.Forbid;
        option.state = state;

        this.dispatchEvent(new CustomEvent('selectionChange', { detail: { option } }));
        this.dispatchEvent(new Event('change'));
        this.requestFullUpdate();
    }
}

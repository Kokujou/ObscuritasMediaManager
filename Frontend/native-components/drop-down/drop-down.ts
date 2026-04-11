import { customElement, property, state } from 'lit-element/decorators';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { LitElementBase } from '../../data/lit-element-base';
import { DropDownOption } from './drop-down-option';
import { renderDropDownStyles } from './drop-down.css';
import { renderDropDown } from './drop-down.html';
import { render } from 'lit';

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

    @property() declare public unsetText: string;
    @property() declare public searchFilter: string;
    @property({ reflect: true }) declare public orientation: 'up' | 'down';
    @property({ type: Number }) declare public maxDisplayDepth: number;
    @property({ type: Number }) declare public _currentIndex: number;
    @property({ type: Boolean, reflect: true }) declare public required: boolean;
    @property({ type: Boolean, reflect: true }) declare public useSearch: boolean;
    @property({ type: Boolean, reflect: true }) declare public useToggle: boolean;
    @property({ type: Boolean, reflect: true }) declare public multiselect: boolean;
    @property({ type: Boolean, reflect: true }) declare public threeValues: boolean;
    @property({ type: Array }) declare public options: DropDownOption<unknown>[];

    @state() declare protected showDropDown: boolean;
    @state() declare protected search: string;
    @state() declare protected focused: DropDownOption<any> | undefined;

    searchResetCallback = setTimeout(() => (this.search = ''), 1000);

    attachShadow(init: ShadowRootInit): ShadowRoot {
        return super.attachShadow({ ...init, mode: 'open', delegatesFocus: true });
    }

    constructor() {
        super();
        this.unsetText = 'Unset';
        this.maxDisplayDepth = 5;
        this.options = [];
        this.tabIndex = 0;

        this.addEventListener('keydown', (e) => {
            if (this.threeValues || this.useToggle || this.multiselect) return;

            e.stopPropagation();
            if (e.key != 'Tab') e.preventDefault();

            switch (e.key) {
                case 'Enter':
                    if (this.showDropDown && this.focused) this.changeOptionState(this.focused, CheckboxState.Ignore);
                    this.toggleDropdown();
                    return;
                case ' ':
                    this.toggleDropdown();
                    return;
                case 'Escape':
                    this.toggleDropdown(false);
                    return;
                case e.key.length == 1 ? e.key : null:
                    this.search += e.key;
                    clearTimeout(this.searchResetCallback);
                    this.searchResetCallback = setTimeout(() => (this.search = ''), 1000);

                    this.changeFocus(
                        this.options.find(
                            (x) =>
                                x.searchableText?.toLocaleLowerCase().startsWith(this.search.toLocaleLowerCase()) ||
                                x.text.toLocaleLowerCase().startsWith(this.search.toLocaleLowerCase()),
                        ),
                    );
                    return;
            }

            if (e.key != 'ArrowUp' && e.key != 'ArrowDown') return;

            var index = this.showDropDown
                ? this.options.orderBy((x) => x.category).findIndex((x) => this.focused?.value == x.value)
                : this.options.orderBy((x) => x.category).findIndex((x) => x.state != CheckboxState.Forbid);

            if (e.key == 'ArrowUp') index--;
            else if (e.key == 'ArrowDown') index++;

            if (index < 0) index = this.options.length - 1;
            if (index >= this.options.length) index = 0;

            this.changeFocus(this.options[index]);
        });

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

    toggleDropdown(targetState?: boolean) {
        this.showDropDown = targetState ?? !this.showDropDown;
        this.focused = undefined;
        if (this.useSearch) this.resetSearchFilter();
        this.shadowRoot!.querySelector('.options')!.scrollTop = 0;
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

    async changeFocus(option: DropDownOption<any> | undefined) {
        if (this.showDropDown) this.focused = option;
        else if (option) this.changeOptionState(option, CheckboxState.Ignore);
        else
            this.changeOptionState(
                this.options.find((x) => x.value == this.options.find((o) => o.state != CheckboxState.Forbid)?.value)!,
                CheckboxState.Forbid,
            );

        await this.requestFullUpdate();
        await this.updateComplete;
        if (this.showDropDown)
            this.shadowRoot!.querySelector('.option[selected]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }) as any;
    }
}

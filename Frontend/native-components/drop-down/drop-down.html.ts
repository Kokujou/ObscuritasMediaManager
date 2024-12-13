import { html } from 'lit-element';
import { CheckboxState } from '../../data/enumerations/checkbox-state';
import { DropDown } from './drop-down';
import { DropDownOption } from './drop-down-option';

export function renderDropDown(this: DropDown) {
    var maxHeight = this.maxDisplayDepth * 40;
    if (this.useSearch) maxHeight += 50;
    return html`
        <style>
            .options {
                max-height: ${maxHeight}px;
            }
        </style>

        ${showDropDown.call(this)}
    `;
}

function showDropDown(this: DropDown) {
    return html`<div
        class="dropdown"
        @click="${() => {
            this.showDropDown = !this.showDropDown;
            if (this.useSearch) this.resetSearchFilter();
        }}"
    >
        <div id="caption-container">
            ${this.caption} ${this.caption ? '' : html`<div id="empty-text-placeholder">empty</div>`}
        </div>
        <div
            class="options"
            @click="${(e: Event) => {
                if (this.multiselect) e.stopPropagation();
            }}"
            @scroll="${(e: Event) => e.preventDefault()}"
            style="display: ${this.showDropDown ? 'block' : 'none'}"
        >
            ${this.useSearch
                ? html`
                      <div
                          @click="${(e: Event) => {
                              e.preventDefault();
                              e.stopPropagation();
                          }}"
                      >
                          <input
                              tabindex="1"
                              type="text"
                              placeholder="Suchtext eingeben..."
                              id="dropdown-search"
                              @input="${(e: Event) => (e.target as HTMLInputElement).dispatchEvent(new Event('change'))}"
                              @change="${() => this.updateSearchFilter()}"
                          />
                      </div>
                  `
                : ''}
            ${this.options
                .filter((x) => x.text.toLocaleLowerCase().match(this.searchFilter?.toLocaleLowerCase()))
                .map((options) => {
                    return renderDropDownOption.call(this, options);
                })}
        </div>
        <div class="dropdown-icon-container ${this.showDropDown ? 'dropped-down' : ''}">></div>
    </div> `;
}

function renderDropDownOption(this: DropDown, option: DropDownOption<any>) {
    return html`
        <div
            ?selected="${option.state != CheckboxState.Forbid}"
            class="option"
            @click=${() =>
                this.changeOptionState(
                    option,
                    option.state == CheckboxState.Ignore ? CheckboxState.Forbid : CheckboxState.Ignore
                )}
        >
            ${this.multiselect && this.useToggle ? renderToggle.call(this, option) : option.text}
        </div>
    `;
}

function renderToggle(this: DropDown, option: DropDownOption<any>) {
    return html`
        <div class="label">${option.text}</div>
        <custom-toggle
            style="--toggled-color:${option.color || 'unset'}"
            .state="${option.state}"
            ?threeValues="${this.threeValues}"
            @toggle="${(e: CustomEvent<CheckboxState>) => this.changeOptionState(option, e.detail)}"
        ></custom-toggle>
    `;
}

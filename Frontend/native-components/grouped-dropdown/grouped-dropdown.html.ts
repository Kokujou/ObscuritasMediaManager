import { html } from 'lit-element';
import { DropdownCategories, GroupedDropdown } from './grouped-dropdown';

export function renderGroupedDropdown(this: GroupedDropdown) {
    var maxHeight = this.maxDisplayDepth * 40;

    return html`
        <style>
            .options {
                max-height: ${maxHeight}px;
            }
        </style>
        <div
            class="dropdown"
            @click="${() => {
                this.showDropDown = !this.showDropDown;
            }}"
        >
            <div id="caption-container">
                ${this.result.value} ${this.result.value ? '' : html`<div id="empty-text-placeholder">empty</div>`}
            </div>
            <div
                class="options"
                tabindex="-1"
                @scroll="${(e: Event) => e.preventDefault()}"
                style="display: ${this.showDropDown ? 'block' : 'none'}"
            >
                ${Object.entries(this.options ?? {}).map((section) => {
                    return renderDropdownSection.call(this, section[0], section[1]);
                })}
            </div>
            <div class="dropdown-icon-container ${this.showDropDown ? 'dropped-down' : ''}">></div>
        </div>
    `;
}

function renderDropdownSection(this: GroupedDropdown, section: keyof DropdownCategories, values: string[]) {
    return html` <div class="dropdown-section">
        <div class="section-title">${section}</div>
        ${values.map((value) => renderDropDownOption.call(this, { category: section, value }))}
    </div>`;
}

function renderDropDownOption(this: GroupedDropdown, value: import('./grouped-dropdown').GroupedDropdownResult) {
    return html`
        <div
            ?selected="${this.result.value == value.value}"
            class="option"
            .value="${value}"
            @click=${() => this.changeResult(value)}
        >
            ${value.value}
        </div>
    `;
}

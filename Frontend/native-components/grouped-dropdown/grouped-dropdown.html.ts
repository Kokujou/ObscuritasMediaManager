import { html } from 'lit-element';
import { GroupedDropdown } from './grouped-dropdown';

/**
 * @param { GroupedDropdown } dropdown
 */
export function renderGroupedDropdown(dropdown: GroupedDropdown) {
    var maxHeight = dropdown.maxDisplayDepth * 40;

    return html`
        <style>
            .options {
                max-height: ${maxHeight}px;
            }
        </style>
        <div
            class="dropdown"
            @click="${() => {
                dropdown.showDropDown = !dropdown.showDropDown;
            }}"
        >
            <div id="caption-container">
                ${dropdown.result.value} ${dropdown.result.value ? '' : html`<div id="empty-text-placeholder">empty</div>`}
            </div>
            <div
                class="options"
                tabindex="-1"
                @scroll="${(e) => dropdown.scroll(e)}"
                style="display: ${dropdown.showDropDown ? 'block' : 'none'}"
            >
                ${Object.entries(dropdown.options).map((section) => {
                    return renderDropdownSection(dropdown, section[0], section[1]);
                })}
            </div>
            <div class="dropdown-icon-container ${dropdown.showDropDown ? 'dropped-down' : ''}">></div>
        </div>
    `;
}

/**
 *
 * @param {GroupedDropdown} dropdown
 * @param {string} section
 * @param {string[]} values
 * @returns
 */
function renderDropdownSection(dropdown: GroupedDropdown, section: string, values: string[]) {
    return html` <div class="dropdown-section">
        <div class="section-title">${section}</div>
        ${values.map((value) => renderDropDownOption(dropdown, { category: section, value }))}
    </div>`;
}

/**
 * @param {GroupedDropdown} dropdown
 * @param {import('./grouped-dropdown').GroupedDropdownResult} value
 */
function renderDropDownOption(dropdown: GroupedDropdown, value: import('./grouped-dropdown').GroupedDropdownResult) {
    return html`
        <div
            ?selected="${dropdown.result.value == value.value}"
            class="option"
            .value="${value}"
            @click=${() => (dropdown.result = value)}
        >
            ${value.value}
        </div>
    `;
}

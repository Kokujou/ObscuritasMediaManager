import { html } from '../../exports.js';
import { GroupedDropdown } from './grouped-dropdown.js';

/**
 * @param { GroupedDropdown } dropdown
 */
export function renderGroupedDropdown(dropdown) {
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
function renderDropdownSection(dropdown, section, values) {
    return html` <div class="dropdown-section">
        <div class="section-title">${section}</div>
        ${values.map((value) => renderDropDownOption(dropdown, { category: section, value }))}
    </div>`;
}

/**
 * @param {GroupedDropdown} dropdown
 * @param {import('./grouped-dropdown.js').GroupedDropdownResult} value
 */
function renderDropDownOption(dropdown, value) {
    return html`
        <div
            ?selected="${dropdown.result.value == value}"
            class="option"
            .value="${value}"
            @click=${() => (dropdown.result = value)}
        >
            ${value.value}
        </div>
    `;
}

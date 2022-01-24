import { html } from '../../exports.js';
import { DropDown } from './drop-down.js';

/**
 * @param {DropDown} dropdown
 */
export function renderDropDown(dropdown) {
    var maxHeight = dropdown.maxDisplayDepth * 40;
    if (dropdown.useSearch) maxHeight += 50;
    return html`
        <style>
            .options {
                max-height: ${maxHeight}px;
            }
        </style>

        ${showDropDown(dropdown)}
    `;
}

/**
 * @param {DropDown} dropdown
 */
function showDropDown(dropdown) {
    return html`<div
        class="dropdown"
        @click="${() => {
            dropdown.showDropDown = !dropdown.showDropDown;
            if (dropdown.useSearch) dropdown.resetSearchFilter();
        }}"
    >
        <div id="caption-container">
            ${dropdown.caption} ${dropdown.caption ? '' : html`<div id="empty-text-placeholder">empty</div>`}
        </div>
        <div
            class="options"
            @click="${(e) => {
                if (dropdown.multiselect) e.stopPropagation();
            }}"
            @scroll="${(e) => dropdown.scroll(e)}"
            style="display: ${dropdown.showDropDown ? 'block' : 'none'}"
        >
            ${dropdown.useSearch
                ? html`
                      <div
                          @click="${(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                          }}"
                      >
                          <input
                              tabindex="1"
                              type="text"
                              placeholder="Suchtext eingeben..."
                              id="dropdown-search"
                              @input="${(e) => e.target.dispatchEvent(new Event('change'))}"
                              @change="${() => dropdown.updateSearchFilter()}"
                          />
                      </div>
                  `
                : ''}
            ${dropdown.options
                .filter((x) => x.toLocaleLowerCase().match(dropdown.searchFilter.toLocaleLowerCase()))
                .map((option) => {
                    return renderDropDownOption(dropdown, option, option);
                })}
        </div>
        <div class="dropdown-icon-container ${dropdown.showDropDown ? 'dropped-down' : ''}">></div>
    </div> `;
}

/**
 * @param {DropDown} dropdown
 * @param {String} key
 * @param {String} value
 */
function renderDropDownOption(dropdown, key, value) {
    return html`
        <div
            ?selected="${dropdown.valueActive(value)}"
            class="option"
            value="${value}"
            @click=${() => {
                if (!dropdown.multiselect || dropdown.useSearch) dropdown.value = value;
            }}
        >
            ${dropdown.multiselect && !dropdown.useSearch ? renderToggle(dropdown, key, value) : key}
        </div>
    `;
}

/**
 * @param {DropDown} dropdown
 * @param {String} key
 * @param {String} value
 */
function renderToggle(dropdown, key, value) {
    return html`
        <div class="label">${key}</div>
        <custom-toggle
            style="--toggled-color:${dropdown.colors[key] || 'unset'}"
            ?checked="${dropdown.valueActive(value)}"
            @toggle="${() => (dropdown.value = value)}"
        ></custom-toggle>
    `;
}

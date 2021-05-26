import { session } from '../../data/session.js';
import { html } from '../../exports.js';
import { DropDown, DropDownStyles } from './drop-down.js';

/**
 * @param {DropDown} dropdown
 */
export function renderDropDown(dropdown) {
    return html`
        <style>
            .options {
                max-height: ${dropdown.maxDisplayDepth * (dropdown.displayStyle == DropDownStyles.solid ? 60 : 26)}px;
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
        <div id="caption-container">${dropdown.value} ${dropdown.value ? '' : html`<div id="empty-text-placeholder">empty</div>`}</div>
        <div class="options" @scroll="${(e) => dropdown.scroll(e)}" style="display: ${dropdown.showDropDown ? 'block' : 'none'}">
            ${dropdown.useSearch
                ? html`
                      <custom-form
                          @click="${(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                          }}"
                      >
                          <input
                              tabindex="1"
                              type="text"
                              .placeholder="${session.resources.current().searchPlaceholder}"
                              id="dropdown-search"
                              @input="${(e) => e.target.dispatchEvent(new Event('change'))}"
                              @change="${() => dropdown.updateSearchFilter()}"
                          />
                      </custom-form>
                  `
                : ''}
            ${dropdown.options
                .filter((x) => x.toLocaleLowerCase().match(dropdown.searchFilter.toLocaleLowerCase()))
                .map((option) => {
                    return renderDropDownOption(dropdown, option, option);
                })}
        </div>
        <div class="dropdown-icon-container ${dropdown.showDropDown ? 'dropped-down' : ''}">^</div>
    </div>`;
}

/**
 * @param {DropDown} dropdown
 * @param {String} key
 * @param {String} value
 */
function renderDropDownOption(dropdown, key, value) {
    return html`
        <div
            class="option ${dropdown.value == value ? 'selected' : ''}"
            value="${value}"
            @click=${() => {
                dropdown.value = value;
            }}
        >
            ${key}
        </div>
    `;
}

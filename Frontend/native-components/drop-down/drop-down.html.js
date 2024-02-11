import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { html } from '../../exports.js';
import { DropDownOption } from './drop-down-option.js';
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
                .filter((x) => x.text.toLocaleLowerCase().match(dropdown.searchFilter.toLocaleLowerCase()))
                .map((options) => {
                    return renderDropDownOption(dropdown, options);
                })}
        </div>
        <div class="dropdown-icon-container ${dropdown.showDropDown ? 'dropped-down' : ''}">></div>
    </div> `;
}

/**
 * @param {DropDown} dropdown
 * @param {DropDownOption} option
 */
function renderDropDownOption(dropdown, option) {
    return html`
        <div
            ?selected="${option.state != CheckboxState.Forbid}"
            class="option"
            @click=${() =>
                dropdown.changeOptionState(
                    option,
                    option.state == CheckboxState.Ignore ? CheckboxState.Forbid : CheckboxState.Ignore
                )}
        >
            ${dropdown.multiselect && dropdown.useToggle ? renderToggle(dropdown, option) : option.text}
        </div>
    `;
}

/**
 * @param {DropDown} dropdown
 * @param {DropDownOption} option
 */
function renderToggle(dropdown, option) {
    return html`
        <div class="label">${option.text}</div>
        <custom-toggle
            style="--toggled-color:${option.color || 'unset'}"
            .state="${option.state}"
            ?threeValues="${dropdown.threeValues}"
            @toggle="${(e) => dropdown.changeOptionState(option, e.detail)}"
        ></custom-toggle>
    `;
}

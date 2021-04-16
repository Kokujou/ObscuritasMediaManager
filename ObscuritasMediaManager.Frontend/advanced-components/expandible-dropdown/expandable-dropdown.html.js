import { html } from '../../exports.js';
import { ExpandableDropdown } from './expandable-dropdown.js';

/**
 * @param {ExpandableDropdown} dropdown
 */
export function renderExpandableDropdown(dropdown) {
    return html`
        <div class="result-filter inactive">
            <div
                class="filter-title"
                @click="${(e) => {
                    if (!dropdown.disabled) ExpandableDropdown.switchActiveClass(e.target.parentElement);
                }}"
            >
                <div class="title-text">${dropdown.caption}</div>
                <div class="title-arrow">⯆</div>
            </div>
            <div class="filter-container">
                <slot></slot>
            </div>
        </div>
    `;
}

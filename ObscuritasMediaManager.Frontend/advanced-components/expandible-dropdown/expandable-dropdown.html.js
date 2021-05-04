import { html } from '../../exports.js';
import { ExpandableDropdown } from './expandable-dropdown.js';

/**
 * @param {ExpandableDropdown} dropdown
 */
export function renderExpandableDropdown(dropdown) {
    return html`
        <div id="result-filter" class="inactive">
            <div
                id="filter-title"
                @click="${(e) => {
                    if (!dropdown.disabled) ExpandableDropdown.switchActiveClass(e.target.parentElement);
                }}"
            >
                <div id="title-text">${dropdown.caption}</div>
                <div id="title-arrow">⯆</div>
            </div>
            <div id="filter-container">
                <slot></slot>
            </div>
        </div>
    `;
}

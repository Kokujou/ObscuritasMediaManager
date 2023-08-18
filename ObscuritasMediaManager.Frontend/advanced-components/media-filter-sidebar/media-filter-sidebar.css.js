import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { css } from '../../exports.js';
import { revertIcon } from '../../resources/icons/general/revert-icon.svg.js';
import { registerIcons } from '../../resources/icons/icon-registry.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderMediaFilterSidebarStyles() {
    return css`
        ${registerIcons()}

        ${renderLanguageFlags()}

        :host {
            border-radius: 50px;

            background: var(--accent-color-full);
            overflow-y: auto;
            overflow-x: hidden;

            padding: 30px 10px;
            box-sizing: border-box;

            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        #heading {
            width: 100%;

            font-size: 36px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 20px;
        }

        #filters {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 30px;

            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: thin;
        }

        .filter-entry {
            display: flex;
            width: 100%;
            font-size: 20px;
            gap: 20px;
        }

        .filter-entry[simple] {
            flex-direction: row;
            align-items: center;
        }

        .filter-entry[complex] {
            flex-direction: column;
            justify-content: center;
        }

        .filter-entry[complex] .filter-label {
            flex: auto;
        }

        .filter-label {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;
        }

        .filter-heading {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;
        }

        .reset-button {
            ${renderMaskImage(revertIcon())};
        }

        #search-input {
            border: none;
            outline: none;
            border-bottom: 1px solid;
            background: none;
            color: inherit;
            font-size: inherit;
            width: 100%;
            padding: 10px 5px;
        }

        #sort-input {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
        }

        #sorting-property-dropdown {
            flex: auto;
        }

        #ascending-icon:not([active]),
        #descending-icon:not([active]) {
            background: gray;
        }

        star-rating {
            margin: -10px 0;
        }

        #release-range-selector {
            width: 100%;
        }

        .icon-button {
            width: 30px;
            height: 30px;

            cursor: pointer;

            background-color: white;
        }

        tri-value-checkbox {
            margin: 0 5px;
        }
    `;
}

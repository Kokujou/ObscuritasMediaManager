import { css } from 'lit';

export function renderMediaFilterSidebarStyles() {
    return css`
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

            font-size: 18px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        #filters {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 0 15px;

            overflow-y: auto;
            overflow-x: hidden;
        }

        .filter-entry {
            display: flex;
            width: 100%;
            font-size: 14px;
            gap: 10px;
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

        #search-input {
            border: none;
            outline: none;
            border-bottom: 2px solid;
            background: none;
            color: inherit;
            font-size: inherit;
            width: 100%;
            padding: 10px 5px;
        }

        #delete-toggle {
            --slider-color: #aaa;
            --toggled-color: #f008;
            --untoggled-color: #f004;
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

        #content-warning-filter tri-value-checkbox,
        #target-group-filter tri-value-checkbox {
            --padding: 10px;
        }

        #content-warning-filter tri-value-checkbox .icon-button,
        #target-group-filter tri-value-checkbox .icon-button {
            width: 25px;
            height: 25px;
        }

        .icon-button {
            width: 20px;
            height: 20px;

            cursor: pointer;

            background-color: white;
        }

        tri-value-checkbox {
            margin: 0 5px;
        }

        #footer {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
        }
    `;
}

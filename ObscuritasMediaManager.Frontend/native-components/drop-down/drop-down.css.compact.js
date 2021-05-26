import { css } from '../../exports.js';

export function renderCompactDropDownStyles() {
    return css`
        :host(.compact) .dropdown {
            color: inherit;
            padding: 10px 0;
            border-bottom: 1px solid lightgray;
        }

        :host(.compact) .options {
            color: black;
            border: none;
            box-shadow: 0px 3px 6px #00000040;
            background-color: white;
        }

        :host(.compact) .option:hover,
        :host(.compact) .option.selected {
            color: var(--dropdown-compact-hover-color, inherit);
            background: lightskyblue;
        }

        :host(.compact) .dropdown-icon-container {
            right: 0;
            top: 15px;
            height: 10px;
        }

        :host(.compact) .option {
            height: auto;
            padding: 15px 10px;
            cursor: pointer;
            white-space: nowrap;
        }

        :host(.compact) .options {
            top: 100%;
        }
    `;
}

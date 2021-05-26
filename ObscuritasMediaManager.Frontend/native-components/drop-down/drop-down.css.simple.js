import { css } from '../../exports.js';

export function renderSimpleDropDownStyles() {
    return css`
        :host(.simple) .dropdown {
            color: var(--ahp-dark-color);
            font-weight: bold;
        }

        :host(.simple) .caption-container {
            color: var(--dropdown-simple-hover-color, inherit);
        }

        :host(.simple) .options {
            border: none;
            box-shadow: 0px 3px 6px #00000029;
            background-color: var(--ahp-bright-color);
        }

        :host(.simple) .option:hover,
        :host(.simple) .option.selected {
            font-weight: bold;
        }

        :host(.simple) .option:hover:not(.selected) {
            color: var(--dropdown-simple-hover-color, inherit);
            cursor: pointer;
        }

        :host(.simple) .dropdown-icon-container > svg {
            fill: var(--font-color);
            stroke: var(--font-color);
        }

        :host(.simple) .option {
            height: auto;
            padding: 5px 20px;
        }

        :host(.simple) .options {
            top: calc(100% - 15px);
        }
    `;
}

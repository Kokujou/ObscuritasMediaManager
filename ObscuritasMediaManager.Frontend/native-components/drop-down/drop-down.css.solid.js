import { css } from '../../exports.js';

export function renderSolidDropDownStyles() {
    return css`
        :host(.solid) .dropdown {
            color: black;
            font-weight: bold;
        }

        :host(.solid) .dropdown,
        :host(.solid) .options {
            border: none;
            box-shadow: 0px 3px 6px #00000029;
            background-color: white;
        }

        :host(.solid) .option:hover,
        :host(.solid) .option.selected {
            color: white;
        }

        :host(.solid) .option:hover:not(.selected) {
            background-color: lightskyblue;
            cursor: pointer;
        }
    `;
}

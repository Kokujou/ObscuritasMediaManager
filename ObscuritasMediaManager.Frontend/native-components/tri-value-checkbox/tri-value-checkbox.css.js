import { css } from '../../exports.js';

export function renderTriValueCheckbox() {
    return css`
        :host {
            display: inline-block;

            --forbid-color: #cc555555;
            --allow-color: #55cc5555;
            --ignore-color: #cccccc55;
        }

        .checkbox {
            position: relative;
            padding: 20px;
            border-radius: 20px;
            border-width: 1px;
            border-style: solid;
            cursor: pointer;
            user-select: none;

            color: white;
            text-shadow: 2px 2px 2px black;
            font-size: 18px;
        }

        .checkbox:active::after {
            content: ' ';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            border-radius: 20px;

            background-color: 0.00000033;
        }

        .checkbox.forbid {
            border-color: var(--forbid-color);
            background-color: var(--forbid-color);
        }

        .checkbox.allow {
            border-color: var(--allow-color);
            background-color: var(--allow-color);
        }

        .checkbox.ignore {
            border-color: var(--ignore-color);
            background-color: var(--ignore-color);
        }

        .checkbox.disabled {
            pointer-events: none;
        }
    `;
}

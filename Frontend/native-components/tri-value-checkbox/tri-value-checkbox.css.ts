import { css } from 'lit';

export function renderTriValueCheckboxStyles() {
    return css`
        :host {
            display: inline-flex;

            --forbid-color: #cc555555;
            --allow-color: #55cc5555;
            --ignore-color: #cccccc55;
        }

        .checkbox {
            position: relative;
            padding: var(--padding, 15px);
            border-radius: 10px;
            border-width: 2px;
            border-style: solid;
            cursor: pointer;
            user-select: none;

            color: white;
            text-shadow: 2px 2px 2px black;
            font-size: 18px;
            white-space: collapse;
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

        :host([value='forbid']) .checkbox {
            border-color: var(--forbid-color);
            background-color: var(--forbid-color);
        }

        :host([value='allow']) .checkbox {
            border-color: var(--allow-color);
            background-color: var(--allow-color);
        }

        :host([value='ignore']) .checkbox {
            border-color: var(--ignore-color);
            background-color: var(--ignore-color);
        }

        :host([disabled]) .checkbox {
            pointer-events: none;
        }
    `;
}

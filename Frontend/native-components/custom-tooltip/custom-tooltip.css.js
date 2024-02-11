import { css } from '../../exports.js';

export const tooltipFadeDuration = 0.5;
export function renderTooltipStyles() {
    return css`
        :host {
            position: fixed;
            padding: 5px 7px;
            border-radius: 5px;

            display: flex;
            z-index: 5000;
            white-space: pre;
            pointer-events: none;
            /* white-space: nowrap; */
            font: inherit;
        }

        :host([anchor='top']) {
            transform: translate(-50%, -100%);
        }

        :host([anchor='bottom']) {
            transform: translate(-50%, 0);
        }

        :host([anchor='left']) {
            transform: translate(-100%, -50%);
        }

        :host([anchor='right']) {
            transform: translate(0, -50%);
        }

        :host([scope='dialog']) {
            background-color: var(--dialog-tooltip-background, #555);
            color: var(--dialog-tooltip-font-color, white);
        }

        :host([scope='default']) {
            background-color: var(--tooltip-background, #555);
            color: var(--tooltip-font-color, white);
        }

        :host([removed]) {
            opacity: 0;
        }
    `;
}

import { css } from '../../exports.js';

export function renderLoadingCircleStyles() {
    return css`
        svg {
            filter: drop-shadow(0 0 5px purple) drop-shadow(0 0 5px purple);
            position: relative;
        }

        * {
            --stroke-dasharray: calc(3.14 * 10%);
            stroke-dasharray: var(--stroke-dasharray);
            stroke-dashoffset: var(--stroke-dasharray);
            stroke: purple;
            stroke-width: 5px;
        }

        path,
        circle {
            animation: dash 1s linear forwards infinite;
            transform-origin: 50% 50%;
        }

        @keyframes dash {
            to {
                rotate: 360deg;
            }
        }
    `;
}

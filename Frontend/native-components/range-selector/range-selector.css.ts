import { css } from 'lit-element';

export function renderRangeSelectorStyles() {
    return css`
        :host {
            position: relative;
            display: block;
            min-height: var(--slider-size, 25px);
            margin-bottom: 20px;
        }

        #container {
            position: absolute;
            inset: 0;
        }

        #range-graph {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            height: var(--graph-thickness, 4px);
            background: var(--graph-color, black);
        }

        #range-hover {
            position: absolute;
            height: 100%;
            background: var(--graph-selected-color, yellow);
            z-index: 1;
        }

        #range-tooltip {
            position: absolute;
            top: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%);
            padding: 5px 10px;
            white-space: nowrap;
        }

        .slider {
            position: absolute;
            top: 50%;
            transform: translateY(-50%) translateX(-50%);
            z-index: 2;

            width: var(--slider-size, 25px);
            height: var(--slider-size, 25px);
            border-radius: 50%;
            background: var(--slider-color, gray);
        }
    `;
}

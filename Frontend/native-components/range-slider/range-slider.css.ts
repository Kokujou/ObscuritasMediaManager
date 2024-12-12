import { css } from 'lit-element';

export function renderRangeSliderStyles() {
    return css`
        :host {
            display: flex;
            align-items: center;
        }

        #slider {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            border-radius: 5px;
            background: var(--background-color, #28b2aaaa);
            outline: none;
        }

        ::-webkit-slider-thumb,
        ::-moz-range-thumb {
            outline: none;
            border: none;
            background: var(--slider-color, var(--accent-color-full));
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
        }
    `;
}

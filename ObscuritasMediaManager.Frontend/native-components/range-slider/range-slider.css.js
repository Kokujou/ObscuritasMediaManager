import { css } from '../../exports.js';

export function renderRangeSliderStyles() {
    return css`
        #slider {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            border-radius: 5px;
            background: #28b2aaaa;
            outline: none;
        }

        ::-webkit-slider-thumb,
        ::-moz-range-thumb {
            outline: none;
            border: none;
            background: var(--accent-color-full);
            width: 25px;
            height: 25px;
            border-radius: 50%;
            cursor: pointer;
        }
    `;
}

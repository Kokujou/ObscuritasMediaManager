import { css } from '../../exports.js';

export function renderDualSliderStyles() {
    return css`
        :host {
            position: relative;
            height: 20px;
            display: block;
        }

        .dual-slider {
            position: absolute;
            left: 0;
            right: 0;
            display: flex;
        }

        .slider-line {
            height: 5px;
            width: 100%;
            border-radius: 5px;
            background-color: #20b2aaaa;
        }

        .slider-line .slider-container {
            background-color: #b2b220aa;
            height: 5px;
            position: absolute;
        }

        .slider-line .slider {
            cursor: pointer;
            position: absolute;
            top: 50%;

            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: var(--accent-color-full);
        }

        #left-slider {
            left: 0;
            transform: translate(-50%, -50%);
        }

        #right-slider {
            right: 0;
            transform: translate(50%, -50%);
        }
    `;
}

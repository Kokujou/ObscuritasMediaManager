import { css } from '../../exports.js';

export function renderCompactAudioPlayerStyles() {
    return css`
        :host {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;
        }

        .button {
            width: 25px;
            height: 25px;
            background: white;

            cursor: pointer;
        }

        #volume-button-container {
            position: relative;
        }

        #volume-slider-container {
            display: none;
            position: absolute;
            left: 50%;
            bottom: calc(100% - 45px);
            padding-left: 50px;
            rotate: -90deg;
            transform-origin: center left;
        }

        #volume-slider {
            width: 100px;
            border-radius: 10px;
            padding: 10px;
            background: gray;
        }

        #volume-button-container:hover #volume-slider-container {
            display: block;
        }
    `;
}

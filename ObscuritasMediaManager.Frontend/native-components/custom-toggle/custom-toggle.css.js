import { css } from '../../exports.js';

export function renderCustomToggleStyles() {
    return css`
        :host {
            position: relative;
            display: block;
            background-color: var(--untoggled-color, #0007);
            border-radius: 5px;
            --width: 60px;
            --height: 30px;
            height: var(--height);
            width: var(--width);
            cursor: pointer;
            transition: background-color 1s ease;

            filter: saturate(1.5);
            box-shadow: 0 0 5px black;
        }

        #slider {
            position: absolute;
            display: inline-block;
            background-color: var(--accent-color-full);
            width: calc(var(--height) - 10px);
            height: calc(var(--height) - 10px);
            margin: 5px;
            border-radius: 3px;
            transition: all 1s ease;
        }

        :host([checked]) {
            background-color: var(--toggled-color, var(--background-color));
        }

        :host([checked]) #slider {
            margin-left: calc(var(--width) - var(--height) + 5px);
            rotate: 180deg;
        }
    `;
}

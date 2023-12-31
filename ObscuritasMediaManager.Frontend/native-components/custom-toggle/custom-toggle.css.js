import { CheckboxState } from '../../data/enumerations/checkbox-state.js';
import { css, unsafeCSS } from '../../exports.js';

export function renderCustomToggleStyles() {
    return css`
        :host {
            position: relative;
            display: block;
            background-color: var(--untoggled-color, #0007);
            border-radius: 7px;
            --width: 60px;
            --height: 30px;
            height: var(--height);
            min-width: var(--width);
            cursor: pointer;
            transition: background-color 1s ease;

            filter: saturate(1.5);
            box-shadow: 0 0 5px black;
        }

        :host([threeValues]) {
            --width: 90px;
        }

        #slider {
            position: absolute;
            display: inline-block;
            background-color: var(--slider-color, #333);
            width: calc(var(--height) - 10px);
            height: calc(var(--height) - 10px);
            margin: 5px;
            border-radius: 5px;
            transition: all 1s ease;
        }

        :host([state='${unsafeCSS(CheckboxState.Ignore)}']) {
            background-color: var(--toggled-color, var(--background-color));
        }

        :host([state='${unsafeCSS(CheckboxState.Ignore)}']) #slider {
            margin-left: calc(var(--width) / 2 - var(--height) / 2 + 5px);
            rotate: 90deg;
        }

        :host([state='${unsafeCSS(CheckboxState.Require)}']),
        :host(:not([threeValues])[toggled]) {
            background-color: var(--toggled-color, var(--background-color));
        }

        :host([state='${unsafeCSS(CheckboxState.Require)}']) #slider,
        :host(:not([threeValues])[state='${unsafeCSS(CheckboxState.Ignore)}']) #slider,
        :host(:not([threeValues])[toggled]) #slider {
            margin-left: calc(var(--width) - var(--height) + 5px);
            rotate: 180deg;
        }
    `;
}

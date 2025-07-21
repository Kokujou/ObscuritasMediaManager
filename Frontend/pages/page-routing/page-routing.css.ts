import { css } from 'lit-element';

export function renderPageRoutingStyles() {
    return css`
        :host {
            position: absolute;
            inset: 0;
            background-position: 0 0;
            font-family: Arial, Helvetica, sans-serif;
        }

        #viewport {
            position: absolute;
            inset: 0;
            overflow-y: auto;
            overflow-x: auto;

            background: linear-gradient(var(--background-color), var(--background-color)), url('resources/images/background.jpg');
            background-blend-mode: overlay;
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }

        #current-page {
            position: absolute;
            inset: 0;
            color: var(--font-color);
        }
    `;
}

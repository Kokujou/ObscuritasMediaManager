import { css } from 'lit-element';

export function renderPageRoutingStyles() {
    return css`
        :host {
            position: absolute;
            inset: 0;

            display: inline-flex;
            background-position: 0 0;
            background: linear-gradient(var(--background-color), var(--background-color)), url('resources/images/background.jpg');
            background-blend-mode: overlay;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            font-family: Arial, Helvetica, sans-serif;
        }

        :host([dimmed]) {
            background: linear-gradient(var(--background-color), var(--background-color)), url('resources/images/background.jpg'),
                linear-gradient(#0005, #0005);
        }

        #current-page {
            position: absolute;
            inset: 0;
            overflow: hidden;

            color: var(--font-color);
        }
    `;
}

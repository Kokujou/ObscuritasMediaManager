import { css } from 'lit-element';
import { viewportHeight, viewportWidth } from '../../extensions/document.extensions';

export function renderPageRoutingStyles() {
    return css`
        :host {
            display: inline-flex;
            background-position: 0 0;
            font-family: Arial, Helvetica, sans-serif;
        }

        #viewport {
            position: relative;
            left: 0;
            top: 0;
            overflow-y: auto;
            overflow-x: auto;

            background: linear-gradient(var(--background-color), var(--background-color)), url('resources/images/background.jpg');
            background-blend-mode: overlay;
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }

        #current-page {
            position: relative;
            left: 0;
            top: 0;
            overflow: hidden;

            color: var(--font-color);

            width: ${viewportWidth}px;
            height: ${viewportHeight}px;
        }
    `;
}

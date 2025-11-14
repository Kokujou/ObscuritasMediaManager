import { css } from 'lit-element';

export function renderWebcomponentTemplateStyles() {
    return css`
        #tile-container {
            position: relative;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;

            cursor: pointer;
        }

        #image-tile {
            display: flex;
            flex-direction: column;
            gap: 20px;
            flex: auto;
            background-color: var(--accent-color);
            padding: 25px 0;
        }

        #image-content {
            flex: auto;

            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }

        #image-text {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            text-shadow: 2px 2px 2px black;
        }
    `;
}

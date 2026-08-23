import { css } from 'lit';

export function renderRecipeTileBaseStyles() {
    return css`
        :host {
            position: relative;
            width: 250px;
            height: 300px;
            margin: 20px;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            cursor: pointer;
        }

        :host([compact]) {
            margin: 0;
        }

        #recipe-images-container {
            position: relative;
            display: flex;
            flex-direction: row;
            flex: auto;
        }

        upload-area {
            z-index: 1;
            position: absolute;
            inset: 0;
        }

        .recipe-image:hover {
            scale: 1.2 !important;
            transition: scale 0.2s ease-in-out;
        }

        .recipe-image:first-of-type {
            transform: none;
        }

        #food-title {
            padding: 5px;
            z-index: 1000;
            white-space: pre-wrap;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            text-shadow:
                0 0 10px purple,
                0 0 5px black,
                0 0 5px black,
                0 0 5px black,
                0 0 5px black,
                0 0 5px black,
                0 0 5px black;
        }
    `;
}

import { css } from 'lit-element';

export function renderRecipeTileBaseStyles() {
    return css`
        :host {
            width: 250px;
            height: 300px;
            margin: 20px;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            cursor: pointer;
        }

        #recipe-images-container {
            position: relative;
            display: flex;
            flex-direction: row;
            flex: auto;
        }

        .recipe-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
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
            text-shadow: 0 0 10px purple, 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black, 0 0 5px black;
        }
    `;
}

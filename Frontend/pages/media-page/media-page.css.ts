import { css } from 'lit-element';

export function renderMediaPageStyles() {
    return css`
        #media-page-container {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            max-height: 100%;
        }

        #media-filter {
            position: absolute;
            right: 0px;
            top: 10px;
            width: 450px;
            height: calc(100% - 10px);
        }

        #results {
            position: absolute;
            bottom: 110px;
            top: 0;
            left: 0;
            right: 460px;
            margin-left: 60px;
        }

        #result-container {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            gap: 60px;
            padding: 80px 0;
        }

        #tile-button {
            width: 200px;
            height: 200px;

            cursor: pointer;
        }

        .tile-button {
            width: 200px;
            height: 200px;
            cursor: pointer;
            background: #fff6;
            align-self: center;
        }

        media-tile {
            cursor: pointer;
            width: 200px;
            min-height: 350px;
        }

        #footer {
            position: absolute;
            bottom: 0;
            height: 100px;
            left: 50px;
            right: 500px;

            display: flex;
            align-items: stretch;
            justify-content: center;
        }

        #result-options {
            background: var(--accent-color);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 40px;
            border-radius: 20px;
            height: 100%;
            padding: 0 30px;
        }

        .option-button {
            width: 40px;
            height: 40px;
            background: white;
            cursor: pointer;
        }

        video:not([src=]) {
            position: fixed !important;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
        }

        .option-button[disabled] {
            background-color: gray;
        }

        *[disabled] {
            color: lightgray;
            pointer-events: none;
        }
    `;
}

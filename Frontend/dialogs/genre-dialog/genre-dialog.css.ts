import { css } from 'lit-element';

export function renderGenreDialogStyles() {
    return css`
        #dialog-content {
            display: flex;
            flex-direction: column;
        }

        #remove-toggle {
            position: absolute;
            top: -75px;
            right: 50px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 10px;
            z-index: 1;
        }

        custom-toggle {
            --accent-color-full: gray;
        }

        #search-input {
            all: unset;
            padding: 10px;
            border-bottom: 1px solid lightgray;
            margin: 20px 80px;
        }

        #genre-container {
            height: 450px;
            width: 700px;
            overflow-y: auto;
        }

        .genre-section {
            position: relative;
            padding-top: 20px;
            padding-bottom: 20px;
            margin-left: 10px;
            margin-right: 10px;
        }

        .genre-section::after {
            content: ' ';
            position: absolute;
            left: 50px;
            bottom: 0;
            right: 50px;
            height: 1px;

            background-color: white;
        }

        .genre-section:last-of-type:after {
            display: none;
        }

        .section-title {
            font-size: 24px;
            margin-bottom: 10px;
            text-shadow: 2px 2px 2px black;
        }

        .genre-checkbox {
            position: relative;
            margin: 10px;
        }

        :host(:not([editModeEnabled])) .remove-genre-button {
            display: none;
            pointer-events: none;
        }

        .remove-genre-button {
            color: white;
            text-align: center;
            font-weight: bold;
            background: red;
            border-radius: 50%;

            display: flex;
            align-items: center;
            justify-content: center;

            position: absolute;
            top: 0;
            right: -10px;
            width: 20px;
            height: 20px;
            z-index: 1;
            overflow: hidden;

            cursor: pointer;

            animation-name: wiggle-in;
            animation-duration: 1s;
            animation-timing-function: linear;
            transform-origin: 50% 0.5em;
        }

        .remove-genre-button:after {
            content: '';
            position: absolute;
            height: 3px;
            left: 5px;
            right: 5px;
            top: calc(50% - 1.5px);
            background: white;
            border-radius: 5px;
        }

        #add-genre-button {
            display: inline-block;
            font-size: 24px;

            padding: 20px;
            border-radius: 20px;
            border-width: 1px;
            border-style: solid;
            cursor: pointer;
            user-select: none;

            color: white;
            text-shadow: 2px 2px 2px black;
        }

        @keyframes wiggle-in {
            0%,
            7% {
                transform: rotateZ(0);
            }
            15% {
                transform: rotateZ(-40deg);
            }
            20% {
                transform: rotateZ(30deg);
            }
            25% {
                transform: rotateZ(-30deg);
            }
            40%,
            100% {
                transform: rotateZ(0);
            }
        }
    `;
}

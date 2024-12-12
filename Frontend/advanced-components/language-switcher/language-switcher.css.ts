import { css } from 'lit-element';

export function renderLanguageSwitcherStyles() {
    return css`
        :host {
            background: #000c !important;
            inset: 0;
            position: absolute;
            mask: none !important;
            z-index: 5;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        :host(.destroyed) {
            transition: opacity 1s linear;
            opacity: 0;
        }

        #language-switcher-overlay {
            position: relative;
            animation: fadeIn 1s linear;
            -moz-animation: fadeIn 1s linear;
            -webkit-animation: fadeIn 1s linear;

            display: flex;
            align-items: center;
            justify-content: center;
            transform-origin: center center;
            backface-visibility: hidden;
            transform-style: preserve-3d;
            pointer-events: none;
        }

        .icon {
            position: absolute;
            top: 50%;
            width: 75px;
            height: 75px;
            border-radius: 50%;
            transition: all 0.5s ease-out;
            pointer-events: none;
            transform-origin: center center;
            backface-visibility: hidden;
            transform-style: preserve-3d;
        }

        #confirm-button {
            position: absolute;
            inset: 43%;
            z-index: 60;
            cursor: pointer;
            pointer-events: all;
            transform: translateZ(500px);
        }

        #confirm-icon {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            background-color: limegreen;
        }

        #close-button {
            position: absolute;
            z-index: 60;
            right: 0;
            top: 50px;
            font-size: 40px;
            cursor: pointer;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
}

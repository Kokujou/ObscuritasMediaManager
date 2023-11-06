import { css } from '../../exports.js';
import { registerIcons } from '../../resources/inline-icons/icon-registry.js';

export function renderLanguageSwitcherStyles() {
    return css`
        ${registerIcons()}

        :host {
            background: #000c;
            inset: 0;
            position: absolute;

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
        }

        .part {
            position: relative;
            width: 50%;
            height: 100%;

            transform-origin: center center;
            mask: linear-gradient(to right, transparent 0 30%, black 70% 100%, transparent 100%);
        }

        .part:nth-of-type(2) {
            transform: scaleX(-1);
        }

        .icon {
            position: absolute;
            top: 50%;
            width: 75px;
            height: 75px;
            border-radius: 50%;
            transition: all 0.5s ease-out;
            pointer-events: none;
        }

        #confirm-button {
            position: absolute;
            inset: 0;
            margin: 33%;
            z-index: 1;
            cursor: pointer;
        }

        #confirm-icon {
            margin: 30%;
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            background-color: limegreen;
        }

        #close-button {
            position: absolute;
            z-index: 1;
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

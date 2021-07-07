import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { css } from '../../exports.js';
import { arrow } from '../../resources/icons/arrow.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderLanguageSwitcherStyles() {
    return css`
        :host(.destroyed) {
            transition: opacity 1s linear;
            opacity: 0;
        }

        #language-switcher-overlay {
            position: absolute;
            inset: 0;
            background: #000a;
            animation: fadeIn 1s linear;
            -moz-animation: fadeIn 1s linear;
            -webkit-animation: fadeIn 1s linear;

            display: flex;
            align-items: center;
            justify-content: center;
        }

        #left-arrow,
        #right-arrow {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 50px;

            ${renderMaskImage(arrow())};
            background-color: white;

            cursor: pointer;
            z-index: 2;
        }

        #left-arrow {
            left: 0;
        }

        #right-arrow {
            right: 0;
            rotate: 180deg;
        }

        #blocked-area {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            mask: linear-gradient(to bottom, red 0% 50%, transparent 70% 100%);
        }

        #blocked-area:before {
            content: ' ';
            position: absolute;
            left: 0;
            right: 0;
            top: 70%;
            bottom: 0%;
            z-index: 1;
        }

        .language-selector-icon {
            position: absolute;
            left: 40%;
            top: 40%;
            width: 60px;
            height: 60px;
            background: lightgray;
            filter: drop-shadow(0 0 10px white);
            cursor: pointer;

            transition: all 0.5s linear;
        }

        #selected-language {
            width: 100px;
            height: 100px;
            filter: drop-shadow(0 0 10px white);
        }

        ${renderLanguageFlags()};

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

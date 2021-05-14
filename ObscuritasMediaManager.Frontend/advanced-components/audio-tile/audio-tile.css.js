import { css, unsafeCSS } from '../../exports.js';
import { NoteIcon } from './icons/general/note-icon.svg.js';
import { englishFlag } from './icons/language-icons/english-flag.svg.js';
import { germanFlag } from './icons/language-icons/german-flag.svg.js';
import { japanFlag } from './icons/language-icons/japan-flag.svg.js';

export function renderAudioTileStyles() {
    return css`
        :host {
            display: inline-flex;
            flex-direction: column;
        }

        #tile-container {
            position: relative;
            width: 100%;
            min-height: inherit;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
            box-shadow: 0 0 50px var(--primary-color);
            border-radius: 20px;

            padding: 10px;

            user-select: none;
        }

        ${renderMoodStyles()}
        ${renderLanguageFlags()}

        #image-box {
            position: relative;
            width: 100%;
            min-height: inherit;
            display: flex;
            background-color: var(--primary-color);
            border-radius: 20px;
        }

        #tile-image {
            margin: 50px;
            position: relative;
            mask: url('data:image/svg+xml;base64, ${unsafeCSS(btoa(NoteIcon()))}');
            background-color: #ffffff99;
            flex: auto;
        }

        #tile-description {
            flex: auto;
            display: flex;
            flex-direction: column;
        }

        #instrument-icons {
            height: 50px;
            width: 100%;
            display: flex;
            flex-direction: row;
        }

        .icon-container {
            position: absolute;
            display: flex;
            flex-direction: row;
            margin: 10px;
        }

        .icon-container > * {
            margin-right: 5px;
        }

        .inline-icon {
            width: 25px;
            height: 20px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
        }

        #language-flags {
            top: 0;
            right: 0;
        }

        #audio-title {
            font-size: 18px;
            color: white;
            text-align: center;
        }
    `;
}

function renderLanguageFlags() {
    return css`
        #language-flags .japanese {
            background-image: url('data:image/svg+xml;base64,${unsafeCSS(btoa(japanFlag()))}');
        }

        #language-flags .german {
            background-image: url('data:image/svg+xml;base64,${unsafeCSS(btoa(germanFlag()))}');
        }

        #language-flags .english {
            background-image: url('data:image/svg+xml;base64,${unsafeCSS(btoa(englishFlag()))}');
        }
    `;
}

function renderMoodStyles() {
    return css`
        #tile-container.happy {
            --primary-color: #008000;
        }
        #tile-container.aggressive {
            --primary-color: #a33000;
        }
        #tile-container.sad {
            --primary-color: #0055a0;
        }
        #tile-container.calm {
            --primary-color: #662200;
        }
        #tile-container.romantic {
            --primary-color: #dd6677;
        }
        #tile-container.dramatic {
            --primary-color: #333333;
        }
        #tile-container.epic {
            --primary-color: #773399;
        }
        #tile-container.funny {
            --primary-color: #a0a000;
        }
        #tile-container.passionate {
            --primary-color: #bb6622;
        }
        #tile-container.monotonuous {
            --primary-color: #999999;
        }
    `;
}

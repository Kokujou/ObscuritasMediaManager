import { renderInstrumentTypeIcons } from '../../data/enumerations/instrument-types.js';
import { renderLanguageFlags } from '../../data/enumerations/nations.js';
import { renderParticipantCountIcon } from '../../data/enumerations/participants.js';
import { css } from '../../exports.js';
import { NoteIcon } from '../../resources/icons/general/note-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { settingsIcon } from '../media-search/images/settings-icon.svg.js';

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
            cursor: pointer;
        }

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
            ${renderMaskImage(NoteIcon())};
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
            align-items: center;
            justify-content: flex-start;
        }

        #instrument-icons > * {
            width: 30px;
            height: 30px;
            margin-right: 10px;
        }

        .icon-container {
            position: absolute;
            display: flex;
            flex-direction: row;
        }

        .icon-container > * {
            margin-right: 5px;
        }

        .inline-icon {
            width: 25px;
            height: 20px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            background-color: #ffffff99;
        }

        .inline-icon.unset {
            display: none;
        }

        ${renderMoodStyles()}
        ${renderLanguageFlags()}
        ${renderParticipantCountIcon()}
        ${renderInstrumentTypeIcons()}

        #language-flags {
            top: 10px;
            left: 10px;
        }

        #language-flags > * {
            opacity: 0.7;
            border-radius: 5px;
        }

        #participant-count-icon {
            bottom: 10px;
            left: 10px;

            width: 40px;
            height: 40px;
        }

        #instrumentation-icon {
            right: 25px;
            bottom: 25px;

            display: flex;
            justify-content: center;
            align-items: center;

            color: #ffffff99;
            background: none;
            text-transform: uppercase;
            font-weight: bold;
            transform: rotate(315deg);
        }

        #audio-title {
            font-size: 18px;
            color: white;
            text-align: center;

            overflow: hidden;
        }

        #edit-icon-container {
            top: 5px;
            right: 5px;
            border-radius: 100%;
            filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.9));
        }

        #edit-icon-container:hover {
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.9));
        }

        #edit-icon-container:active {
            filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.9));
        }

        #edit-icon {
            border-radius: 100%;
            margin: 0;
            width: 35px;
            height: 35px;
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
            ${renderMaskImage(settingsIcon())};
        }

        #audio-genre-section {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            max-height: 35px;

            margin-top: 10px;
            overflow: hidden;

            mask: linear-gradient(to bottom, black 0% 50%, transparent 100%);
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            transition: all 1s ease-out;
        }

        :host(:hover) #audio-genre-section {
            max-height: 150px;
            mask-size: 100% 300%;
        }

        #audio-genre-section * {
            margin-left: 5px;
            margin-bottom: 5px;
            z-index: 1;
            --label-color: var(--primary-color);
        }
    `;
}

function renderMoodStyles() {
    return css`
        #tile-container {
            --primary-color: #dddddd;
        }
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

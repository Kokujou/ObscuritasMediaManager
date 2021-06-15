import { renderInstrumentTypeIcons } from '../../data/enumerations/instrument-types.js';
import { renderLanguageFlags } from '../../data/enumerations/nations.js';
import { renderParticipantCountIcon } from '../../data/enumerations/participants.js';
import { css } from '../../exports.js';
import { revertIcon } from '../../resources/icons/general/revert-icon.svg.js';
import { popupIcon } from '../../resources/icons/popup-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderMusicFilterStyles() {
    return css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            min-height: 0;
            max-width: 100%;
        }

        #search-panel-container > * {
            margin: 10px 0;
        }

        #search-panel {
            display: flex;
            flex-direction: column;

            width: 100%;
            flex: auto;
            margin: 20px 0;

            font-size: 24px;
            overflow-y: auto;
        }

        #search-heading {
            font-size: 30px;
            text-align: center;

            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            margin-top: 30px;
        }

        #search-heading .inline-icon {
            margin-left: 20px;
        }

        .filter {
            margin-bottom: 30px;
        }

        .filter > .filter-heading {
            margin-bottom: 10px;
            display: flex;
            flex-direction: row;
            width: 100%;
            margin: 30px 0;
        }

        .popup-icon {
            ${renderMaskImage(popupIcon())};
            background-color: lightseagreen;
            margin-left: 20px;
            cursor: pointer;
        }

        .reset-icon {
            ${renderMaskImage(revertIcon())};
            background-color: lightseagreen;
            margin-right: 20px;
            cursor: pointer;
            margin-left: auto;
        }

        #search-panel > * {
            flex: auto;
        }

        .side-scroller-container {
            position: relative;
            width: 100%;
            padding: 0 30px;
            box-sizing: border-box;
        }

        side-scroller {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;

            color: white;
        }

        .icon-container {
            margin-right: 20px;
        }

        .inline-icon {
            width: 30px;
            height: 30px;

            background-color: #ffffff99;
        }

        ${renderInstrumentTypeIcons('#instrument-type-filter ')}
        ${renderLanguageFlags()}
        ${renderParticipantCountIcon('#participant-count-filter ')}
        

        drop-down {
            font: inherit;
            font-size: 20px;
            width: 90%;

            color: white;
        }
    `;
}

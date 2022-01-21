import { renderInstrumentTypeIcons } from '../../data/enumerations/instrument-types.js';
import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { renderParticipantCountIcon } from '../../data/enumerations/participants.js';
import { css } from '../../exports.js';
import { registerIcons } from '../../resources/icons/icon-registry.js';

export function renderMusicFilterStyles() {
    return css`
        ${registerIcons()}

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

        .filter > .filter-heading {
            margin-bottom: 10px;
            display: flex;
            flex-direction: row;
            width: 100%;
            margin: 30px 0;
        }

        .heading-label {
            margin-right: auto;
        }

        .popup-icon {
            margin-left: 20px;
        }

        .reset-icon {
            margin-right: 20px;
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

        .inline-icon,
        .icon-button {
            width: 30px;
            height: 30px;
            cursor: pointer;

            background-color: #ffffff99;
        }

        .icon-button {
            margin: 0 5px;
        }

        #complete-input {
            margin-left: 20px;
        }

        ${renderInstrumentTypeIcons('#instrument-type-filter ')}
        ${renderLanguageFlags()}
        ${renderParticipantCountIcon('#participant-count-filter ')}
        

        drop-down {
            font: inherit;
            font-size: 20px;
            width: 90%;

            color: white;
            --toggled-color: purple;
        }

        input[type='text'] {
            font-size: 20px;
            width: 100%;
            background: transparent;
            color: var(--font-color);
            border: none;
            border-bottom: 5px solid black;
            padding: 10 20px;
            outline: none;
        }

        input[type='checkbox'] {
            transform: scale(1.5);
            margin: 0 20px;
        }

        #complete-filter {
            margin-top: 30px;
            display: flex;
            align-items: center;
        }
    `;
}

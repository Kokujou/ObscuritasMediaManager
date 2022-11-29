import { renderInstrumentTypeIcons } from '../../data/enumerations/instrument-types.js';
import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { renderParticipantCountIcon } from '../../data/enumerations/participants.js';
import { css } from '../../exports.js';
import { registerIcons } from '../../resources/icons/icon-registry.js';
import { pauseIcon } from '../../resources/icons/music-player-icons/pause-icon.svg.js';
import { playIcon } from '../../resources/icons/music-player-icons/play-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderAudioTileBaseStyles() {
    return css`
        ${registerIcons()}

        :host {
            position: relative;
            transform: rotate(0deg);
        }

        #audio-tile-container {
            position: absolute;
            inset: 0;
            border-radius: 10%;
            background-color: var(--primary-color);
            overflow: hidden;
        }

        #audio-image {
            position: absolute;
            inset: 25%;
            background-color: var(--font-color);

            cursor: pointer;
        }

        .inline-icon {
            width: 12%;
            height: 12%;
            background-color: var(--font-color);
            border-radius: 2%;
            cursor: pointer;
            filter: drop-shadow(0 0 5px black);
        }

        #nation-icon,
        #language-icon {
            position: absolute;
            right: 5%;
            top: 5%;
            width: 20%;
            height: 20%;
            border-radius: 100%;
            cursor: pointer;
            filter: drop-shadow(0 0 5px black);
        }

        #nation-icon {
            mask: linear-gradient(295deg, white 0 50%, transparent 50% 100%);
        }

        #language-icon {
            mask: linear-gradient(115deg, white 0 50%, transparent 50% 100%);
        }

        ${renderLanguageFlags()}

        #instrumentation-button {
            position: absolute;
            left: 0;
            top: 7.5%;
            width: 40%;
            height: 10%;

            background: none;
            text-transform: uppercase;
            font-weight: bold;
            font-family: inherit;
            stroke: var(--font-color);
            fill: var(--font-color);
        }

        #rating-container {
            position: absolute;
            top: 20%;
            left: 5%;
            width: 10%;
            height: 70%;

            filter: drop-shadow(3px 3px 3px black);
        }

        #rating-container .star {
            stroke: gray;
            fill: gray;
            width: 100%;

            cursor: pointer;
            line-height: 1;
        }

        #rating-container .star.selected {
            stroke: yellow;
            fill: yellow;
        }

        #rating-container .star.hovered {
            stroke: darkorange;
            fill: darkorange;
        }

        #participant-count-button {
            position: absolute;
            right: 5%;
            bottom: 20%;
        }

        ${renderParticipantCountIcon('#participant-count-button')}

        #instruments-container {
            position: absolute;
            bottom: 5%;
            left: 5%;
            right: 5%;
            height: 12%;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        .instrument-icon {
            height: 100%;
            margin-right: 2%;
        }

        #add-instruments-link {
            font-size: 24px;
            text-decoration: underline;
        }

        ${renderInstrumentTypeIcons('#instruments-container ')}

        :host(:not([paused])) #audio-image {
            ${renderMaskImage(pauseIcon())};
        }

        :host([paused]) #audio-image {
            ${renderMaskImage(playIcon())};
        }
    `;
}

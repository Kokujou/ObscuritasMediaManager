import { renderInstrumentTypeIcons } from '../../data/enumerations/instrument-types.js';
import { renderMoodStyles } from '../../data/enumerations/mood.js';
import { renderLanguageFlags } from '../../data/enumerations/nation.js';
import { renderParticipantCountIcon } from '../../data/enumerations/participants.js';
import { css } from '../../exports.js';
import { revertIcon } from '../../resources/icons/general/revert-icon.svg.js';
import { volumeIcon } from '../../resources/icons/music-player-icons/change-volume-icon.svg.js';
import { fastForwardIcon } from '../../resources/icons/music-player-icons/fast-forward-icon.svg.js';
import { pauseIcon } from '../../resources/icons/music-player-icons/pause-icon.svg.js';
import { playIcon } from '../../resources/icons/music-player-icons/play-icon.svg.js';
import { shufflePlaylistIcon } from '../../resources/icons/playlist-icons/shuffle-playlist-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

/**
 * TODO: - change detection - autosave
 * TODO: - isntrument selection
 * TODO: - reset functionality
 */

export function renderMusicPlaylistStyles() {
    return css`
        * {
            scrollbar-width: thin;
        }

        ${renderMoodStyles('#music-player-container')}

        #music-player-container {
            position: absolute;
            left: 50px;
            right: 50px;
            top: 50px;
            bottom: 50px;
            display: flex;
            flex-direction: column;

            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
            box-shadow: 0 0 50px var(--primary-color);
            border-radius: 20px;
            overflow: hidden;

            color: var(--font-color);
        }

        #current-track-container {
            position: relative;
            display: flex;
            flex-direction: row;
            margin: 20px;
        }

        #mood-switcher {
            position: relative;
            align-self: center;
            min-height: 250px;
            max-height: 250px;
            height: 250px;
            min-width: 200px;
            max-width: 200px;
            width: 200px;

            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
            border: 2px solid var(--primary-color);
        }

        #mood-container {
            position: absolute;
            left: 0;
            right: 0;
            top: 0px;
            bottom: 0px;

            display: flex;
            flex-direction: column;
        }

        #audio-tile-container {
            position: relative;
            min-width: 400px;
            height: 400px;
            border-radius: 20px;
            background-color: var(--primary-color);
            overflow: hidden;
        }

        #audio-image {
            position: absolute;
            left: 100px;
            right: 100px;
            bottom: 100px;
            top: 100px;
            background-color: var(--font-color);

            cursor: pointer;
        }

        .inline-icon {
            width: 60px;
            height: 50px;
            background-color: var(--font-color);
            border-radius: 10px;
            cursor: pointer;
            filter: drop-shadow(0 0 5px black);
        }

        #language-icon-section {
            display: flex;
            flex-direction: row;

            position: absolute;
            left: 20px;
            top: 20px;
        }

        #language-icon-section > * {
            margin-right: 10px;
        }

        ${renderLanguageFlags()}

        #instrumentation-button {
            position: absolute;
            right: 50px;
            top: 60px;

            display: flex;
            justify-content: center;
            align-items: center;

            background: none;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 30px;
            transform: rotate(45deg);
        }

        #rating-container {
            position: absolute;
            bottom: 70px;
            left: 20px;
        }

        #rating-container .star {
            color: gray;
            text-shadow: 3px 3px 3px black;
            font-size: 48px;
            cursor: pointer;
            line-height: 1;
        }

        #rating-container .star.selected {
            color: yellow;
        }

        #rating-container .star.hovered {
            color: darkorange;
        }

        #participant-count-button {
            position: absolute;
            right: 20px;
            bottom: 70px;

            width: 50px;
            height: 50px;
        }

        ${renderParticipantCountIcon('#participant-count-button')}

        #instruments-container {
            position: absolute;
            bottom: 20px;
            left: 10px;
            right: 10px;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }

        #instruments-container .instrument-icon {
            background: white;
            width: 40px;
            height: 40px;
            margin: 0 5px;
        }

        #add-instruments-link {
            font-size: 24px;
            text-decoration: underline;
        }

        ${renderInstrumentTypeIcons('#instruments-container .instrument-icon')}

        #audio-control-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: var(--primary-color);
            flex: auto;
            border-radius: 20px;
            margin: 50px;
            min-width: 0;
            padding: 20px;
        }

        #audio-title {
            font-size: 30px;
            min-width: 300px;
            max-width: 100%;
        }

        #audio-subtitle {
            font-size: 24px;
            display: flex;
            flex-direction: row;
            min-width: 300px;
        }

        #audio-subtitle > * {
            flex: auto;
            margin-top: -10px;
        }

        #subtitle-separator {
            margin: 0 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #genre-section {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }

        tag-label {
            font-size: 18px;
            color: var(--font-color);
            --label-color: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
            margin-bottom: 10px;
        }

        #track-position-container {
            width: 100%;
            height: 50px;

            filter: drop-shadow(0 0 10px black);

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        #track-position-label {
            font-size: 18px;
        }

        #track-position {
            flex: auto;
            margin: 0 20px;
        }

        #audio-controls {
            display: flex;
            flex-direction: row;
            filter: drop-shadow(0 0 10px #000000);
            margin-top: 10px;
        }

        #audio-controls > * {
            margin-right: 30px;
        }

        #change-volume-container {
            display: flex;
            flex-direction: row;
        }

        #change-volume {
            margin: 0 10px;
        }

        range-slider {
            --background-color: #00000055;
            --slider-color: var(--primary-color);
        }

        ${renderAudioPlayerIcons()}

        #playlist-container {
            display: flex;
            flex-direction: row;

            border-radius: 20px;
            box-sizing: border-box;
            border: 20px solid var(--primary-color);
            margin: 20px 50px;
        }

        #playlist-container #playlist-options {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            padding-left: 10px;
            padding-right: 30px;
            background: var(--primary-color);
        }

        #playlist-item-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            flex: auto;

            overflow-y: auto;
            overflow-x: hidden;

            font-weight: bold;
        }

        .playlist-entry {
            padding: 5px 20px;
            font-size: 18px;
            cursor: pointer;
            background: linear-gradient(#00000077 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        .playlist-entry:hover {
            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        .playlist-entry.active {
            background: linear-gradient(#00000033 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        audio {
            display: none;
        }
    `;
}

function renderAudioPlayerIcons() {
    return css`
        .audio-icon {
            background: var(--font-color);
            width: 50px;
            height: 50px;
            cursor: pointer;
        }

        #previous-track-button {
            ${renderMaskImage(fastForwardIcon())};
            transform: rotate(180deg);
        }

        #toggle-track-button.playing,
        #audio-tile-container #audio-image.playing {
            ${renderMaskImage(pauseIcon())};
        }

        #toggle-track-button.paused,
        #audio-tile-container #audio-image.paused {
            ${renderMaskImage(playIcon())};
        }

        #toggle-track-button.playing {
            ${renderMaskImage(pauseIcon())};
        }

        #next-track-button {
            ${renderMaskImage(fastForwardIcon())};
        }

        #change-volume-button {
            ${renderMaskImage(volumeIcon())};
        }

        #random-order-button {
            ${renderMaskImage(shufflePlaylistIcon())};
        }

        #reset-order-button {
            ${renderMaskImage(revertIcon())};
        }

        #remove-track-button {
            mask: linear-gradient(transparent, transparent);
        }
    `;
}

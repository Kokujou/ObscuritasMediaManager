import { renderMoodStyles } from '../../data/enumerations/mood.js';
import { renderLanguageFlags } from '../../data/enumerations/nations.js';
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
            min-width: 350px;
            height: 400px;
            border-radius: 20px;
            background-color: var(--primary-color);
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

        #participant-count-button {
            position: absolute;
            left: 20px;
            bottom: 70px;

            width: 50px;
            height: 50px;
        }

        ${renderParticipantCountIcon('#participant-count-button')}

        #instrumentation-button {
            position: absolute;
            right: 50px;
            bottom: 70px;

            display: flex;
            justify-content: center;
            align-items: center;

            background: none;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 30px;
            transform: rotate(315deg);
        }

        #track-position-container {
            position: absolute;
            bottom: 0px;
            left: 20px;
            right: 20px;
            height: 50px;
            filter: drop-shadow(0 0 10px black);

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        #track-position {
            flex: auto;
        }

        #language-switcher-overlay {
            position: absolute;
            left: 0;
            top: 100px;
            bottom: 100px;
            right: 0;
        }

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
            margin-bottom: 30px;
        }

        #audio-subtitle > * {
            flex: auto;
        }

        #subtitle-separator {
            margin: 0 20px;
            display: flex;
            align-items: Center;
            justify-content: center;
        }

        #audio-controls {
            display: flex;
            flex-direction: row;
            filter: drop-shadow(0 0 10px #000000);
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

        #playlist-item-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            flex: auto;
            margin: 20px 50px;

            overflow-y: auto;
            overflow-x: hidden;

            border-radius: 20px;
            box-sizing: border-box;
            border: 20px solid var(--primary-color);
            font-weight: bold;
        }

        .playlist-entry {
            padding: 5px;
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

        #audio-controls #previous-track-button {
            ${renderMaskImage(fastForwardIcon())};
            transform: rotate(180deg);
        }

        #audio-controls #toggle-track-button.playing,
        #audio-tile-container #audio-image.playing {
            ${renderMaskImage(pauseIcon())};
        }

        #audio-controls #toggle-track-button.paused,
        #audio-tile-container #audio-image.paused {
            ${renderMaskImage(playIcon())};
        }

        #audio-controls #toggle-track-button.playing {
            ${renderMaskImage(pauseIcon())};
        }

        #audio-controls #next-track-button {
            ${renderMaskImage(fastForwardIcon())};
        }

        #audio-controls #change-volume-button {
            ${renderMaskImage(volumeIcon())};
        }

        #audio-controls #random-order-button {
            ${renderMaskImage(shufflePlaylistIcon())};
        }

        #audio-controls #reset-order-button {
            ${renderMaskImage(revertIcon())};
        }

        #audio-controls #remove-track-button {
            mask: linear-gradient(transparent, transparent);
        }
    `;
}

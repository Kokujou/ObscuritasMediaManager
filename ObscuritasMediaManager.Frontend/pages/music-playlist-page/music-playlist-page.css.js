import { renderLanguageFlags } from '../../data/enumerations/nations.js';
import { renderParticipantCountIcon } from '../../data/enumerations/participants.js';
import { css } from '../../exports.js';

/**
 * TODO: - change detection - autosave
 * TODO: - isntrument selection
 */

export function renderMusicPlaylistStyles() {
    return css`
        * {
            scrollbar-width: thin;
        }

        ${renderMoodStyles()}

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
            color: black;
        }

        #current-track-container {
            display: flex;
            flex-direction: row;
            margin: 20px;
        }

        #mood-switcher {
            position: relative;
            align-self: center;
            min-height: 250px;
            max-height: 250px;
            min-width: 200px;
            max-width: 200px;

            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
            background: linear-gradient(#00000099 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
        }

        #mood-container {
            position: absolute;
            left: 0;
            right: 0;
            top: 0px;
            bottom: 0px;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: none;

            display: flex;
            flex-direction: column;

            mask: radial-gradient(closest-side, black, transparent 100%);
        }

        #mood-container .fade-space {
            content: ' ';
            min-height: 100px;
            width: 100%;
        }

        .change-mood-button {
            text-align: center;
            width: 100%;
            padding: 10px 10px;
            font-size: 18px;
            font-weight: bold;
            color: var(--primary-color);
            border-top: 0.5px solid var(--primary-color);
            border-bottom: 0.5px solid var(--primary-color);
            box-sizing: border-box;
        }

        #audio-tile-container {
            position: relative;
            width: 400px;
            height: 400px;
            border-radius: 20px;
            background-color: var(--primary-color);
        }

        #main-image {
            position: absolute;
            left: 50px;
            right: 50px;
            bottom: 50px;
            top: 50px;
        }

        .inline-icon {
            width: 60px;
            height: 50px;
            background-color: white;
            filter: drop-shadow(0 0 5px black);
            border-radius: 10px;
            cursor: pointer;
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
            bottom: 20px;

            width: 50px;
            height: 50px;
        }

        ${renderParticipantCountIcon('#participant-count-button')}

        #instrumentation-button {
            position: absolute;
            right: 50px;
            bottom: 50px;

            display: flex;
            justify-content: center;
            align-items: center;

            color: black;
            background: none;
            text-transform: uppercase;
            font-weight: bold;
            font-size: 30px;
            transform: rotate(315deg);
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
        }

        #audio-title {
            font-size: 30px;
        }

        #audio-subtitle {
            font-size: 20px;
            display: flex;
            flex-direction: column;
        }

        #audio-controls {
            display: flex;
            flex-direction: row;
        }

        #playlist-container {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: auto;

            margin: 20px 50px;
        }

        #playlist-item-container {
            position: absolute;
            left: 200px;
            right: 200px;
            bottom: 75px;
            top: 0;

            overflow-y: auto;
            overflow-x: hidden;

            background-color: var(--primary-color);
            border-radius: 20px;
            padding: 20px;
            box-sizing: border-box;
        }

        #playlist-option-container {
            position: absolute;
            display: flex;
            flex-direction: row;
            background-color: var(--primary-color);
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            border-radius: 20px;
        }
    `;
}

function renderMoodStyles() {
    return css`
        #music-player-container {
            --primary-color: #dddddd;
        }
        #music-player-container.happy {
            --primary-color: #008000;
        }
        #music-player-container.aggressive {
            --primary-color: #a33000;
        }
        #music-player-container.sad {
            --primary-color: #0055a0;
        }
        #music-player-container.calm {
            --primary-color: #662200;
        }
        #music-player-container.romantic {
            --primary-color: #dd6677;
        }
        #music-player-container.dramatic {
            --primary-color: #333333;
        }
        #music-player-container.epic {
            --primary-color: #773399;
        }
        #music-player-container.funny {
            --primary-color: #a0a000;
        }
        #music-player-container.passionate {
            --primary-color: #bb6622;
        }
        #music-player-container.monotonuous {
            --primary-color: #999999;
        }
    `;
}

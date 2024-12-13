import { css } from 'lit-element';

export function renderMusicPlaylistStyles() {
    return css`
        * {
            scrollbar-width: thin;
        }

        #music-player-container {
            position: absolute;
            left: 50px;
            right: 50px;
            top: 20px;
            bottom: 20px;
            display: flex;
            flex-direction: column;

            background: linear-gradient(#00000033 0% 100%), linear-gradient(var(--secondary-color) 0% 100%);
            box-shadow: 0 0 50px var(--secondary-color);
            border-radius: 20px;
            overflow: hidden;

            color: var(--font-color);
        }

        #complete-checkbox {
            display: flex;
            flex-direction: row;

            position: absolute;
            top: 25px;
            right: 25px;

            font-size: 20px;
            font-weight: bold;
            z-index: 2;
        }

        #complete-checkbox .label {
            margin-right: 10px;
        }

        #complete-checkbox input[type='checkbox'] {
            transform: scale(1.5);
        }

        #current-track-container {
            position: relative;
            display: flex;
            flex-direction: row;
            margin: 20px;
        }

        #mood-switcher-container {
            align-self: center;
            display: flex;
            flex-direction: column;
        }

        #mood-tabs {
            display: flex;
            flex-direction: row;
            align-self: center;
            margin-top: -60px;
            margin-bottom: 10px;
            gap: 20px;
        }

        .mood-tab {
            font-size: 24px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
        }

        #first-mood {
            background: linear-gradient(var(--primary-color) 0% 100%);
            border: 2px solid var(--primary-color);
            color: var(--font-color);
        }

        #second-mood {
            background: linear-gradient(#00000033 0% 100%), linear-gradient(var(--secondary-color) 0% 100%);
            border: 2px solid var(--secondary-color);
            color: var(--secondary-font-color);
        }

        #mood-switcher {
            position: relative;
            min-height: 250px;
            max-height: 250px;
            height: 250px;
            min-width: 200px;
            max-width: 200px;
            width: 200px;

            border-top-left-radius: 20px;
            border-bottom-left-radius: 20px;
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
            display: flex;
            flex-direction: column;
        }

        audio-tile-base {
            min-width: 400px;
            height: 400px;
        }

        #show-lyrics-link {
            margin-top: 10px;
            align-self: center;
            font-weight: bold;
            font-size: 24px;
            cursor: pointer;
        }

        #show-lyrics-link:hover {
            text-decoration: underline;
        }

        .inline-icon {
            width: 60px;
            height: 50px;
            background-color: var(--font-color);
            border-radius: 10px;
            cursor: pointer;
            filter: drop-shadow(0 0 5px black);
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
            margin-bottom: 0;
            min-width: 0;
            padding: 20px;
            gap: 20px;
        }

        #audio-title {
            font-size: 30px;
            max-width: 100%;
            margin-top: -10px;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        #audio-subtitle {
            font-size: 24px;
            display: flex;
            flex-direction: row;
            min-width: 300px;
        }

        #audio-subtitle > * {
            flex: auto;
            margin-top: -10px !important;
        }

        #subtitle-separator {
            margin: 0 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        link-element {
            text-decoration: underline;
            text-overflow: ellipsis;
        }

        #genre-section {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
        }

        tag-label {
            font-size: 18px;
            color: var(--font-color);
            --label-color: linear-gradient(#00000033 0% 100%), linear-gradient(var(--secondary-color) 0% 100%);
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
            --background-color: #00000033;
            --slider-color: var(--secondary-color);
        }

        ${renderAudioPlayerIcons()}

        audio {
            display: none;
        }

        #change-path-container {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10px;
            font-size: 20px;
            font-weight: bold;
        }

        #path-input {
            color: inherit;
            font-size: inherit;
            flex: auto;
            background: transparent;
            border: none;
            border-bottom: 1px solid;
            padding: 10px 10px;
            white-space: nowrap;
            user-select: text;
        }

        #change-path-button {
            width: 40px;
            height: 40px;
        }

        input.editable-label {
            outline: none;
            border: none;
            border-bottom: 1px solid;
            font: inherit;
            color: inherit;
            background: none;
            min-width: 300px;
            text-align: center;
        }

        input.editable-label[disabled] {
            border: none;
        }

        #edit-playlist-link {
            font-size: 30px;
            font-weight: bold;
            align-self: center;
            justify-self: center;
            margin-top: 10px;
            margin-bottom: 20px;
            cursor: pointer;

            display: flex;
            flex-direction: row;
            gap: 10px;
            align-items: center;
            justify-content: center;
            border-bottom: 4px solid;
            border-color: transparent;
        }

        #edit-playlist-link:hover {
            border-color: inherit;
        }

        #edit-playlist-icon {
            width: 30px;
            height: 30px;
            background: var(--font-color);
        }

        #create-track-icon {
            width: 30px;
            height: 30px;
            background: var(--font-color);
        }

        #media-playlist-container {
            display: inline-flex;
            flex: auto;
            padding: 0 50px;
            padding-bottom: 20px;
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
            transform: rotate(180deg);
        }

        *[disabled] * {
            pointer-events: none;
        }
    `;
}

import { css } from 'lit-element';

export function renderMusicPlaylistStyles() {
    return css`
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
            align-items: center;

            position: absolute;
            top: 20px;
            right: 20px;

            font-size: 14px;
            font-weight: bold;
            z-index: 2;
        }

        #complete-checkbox .label {
            margin-right: 5px;
        }

        #current-track-container {
            position: relative;
            display: flex;
            flex-direction: row;
            margin: 20px;
        }

        #mood-switcher-container {
            align-self: flex-start;
            display: flex;
            flex-direction: column;
            margin-top: 80px;
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
            font-size: 16px;
            width: 30px;
            height: 30px;
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
            min-height: 200px;
            max-height: 200px;
            height: 200px;
            min-width: 175px;
            max-width: 175px;
            width: 175px;

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
            min-width: 300px;
            height: 300px;
        }

        #show-lyrics-link {
            margin-top: 10px;
            align-self: center;
            font-weight: bold;
            font-size: 16px;
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
            margin: 30px;
            margin-bottom: 0;
            min-width: 0;
            padding: 20px;
            gap: 20px;
        }

        #audio-title {
            font-size: 18px;
            max-width: 100%;
            margin-top: -10px;

            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        #audio-subtitle {
            font-size: 16px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        #audio-subtitle > * {
            width: 100%;
            margin-top: -10px !important;
        }

        #subtitle-separator {
            margin: 0 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: unset;
        }

        .media-link {
            text-align: center;
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
            font-size: 14px;
            color: var(--font-color);
            --label-color: linear-gradient(#00000033 0% 100%), linear-gradient(var(--secondary-color) 0% 100%);
        }

        #track-position-container {
            width: 100%;
            height: 30px;

            filter: drop-shadow(0 0 10px black);

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        #track-position-label {
            font-size: 14px;
        }

        #track-position {
            flex: auto;
            margin: 0 10px;
        }

        #audio-controls {
            display: flex;
            flex-direction: row;
            filter: drop-shadow(0 0 10px #000000);
        }

        #audio-controls > * {
            margin-right: 15px;
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
            font-size: 14px;
            font-weight: bold;
        }

        #path-input {
            color: inherit;
            font-size: inherit;
            flex: auto;
            background: transparent;
            border: none;
            border-bottom: 2px solid;
            padding: 10px 10px;
            white-space: nowrap;
            user-select: text;
        }

        #change-path-button {
            width: 20px;
            height: 20px;
        }

        input.editable-label {
            outline: none;
            border: none;
            border-bottom: 2px solid;
            font: inherit;
            color: inherit;
            background: none;
            text-align: center;
        }

        input.editable-label[disabled] {
            border: none;
        }

        #edit-playlist-link {
            font-size: 16px;
            font-weight: bold;
            align-self: center;
            justify-self: center;
            margin-bottom: 10px;
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
            padding: 0 30px;
            padding-bottom: 20px;
        }
    `;
}

function renderAudioPlayerIcons() {
    return css`
        .audio-icon {
            background: var(--font-color);
            width: 30px;
            height: 30px;
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

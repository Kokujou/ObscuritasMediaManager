import { css } from 'lit-element';

export function renderMusicPageStyles() {
    return css`
        #music-page {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }

        #search-panel-container {
            position: absolute;
            top: 0;
            right: 25px;
            width: 400px;
            bottom: 100px;

            padding: 0 20px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background-color: var(--accent-color);
            border-radius: 20px;
        }

        #music-filter {
            flex: auto;
        }

        #result-count-label {
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-shadow: 3px 3px 10px black;
            color: white;
        }

        ${renderResultOptionsBar()}

        #search-results {
            padding-left: 50px;
            padding-top: 20px;
            padding-bottom: 50px;
            box-sizing: border-box;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;

            border-radius: 20px;
        }

        #search-results-container {
            position: absolute;
            bottom: 150px;
            left: 0;
            right: 500px;
            top: 0;
        }

        .audio-link-container {
            position: relative;
            margin: 25px;
        }

        .audio-select {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 30px;
            height: 30px;
            z-index: 1;
        }

        audio-tile,
        playlist-tile {
            display: inline-block;
            position: relative;
            width: 275px;
            min-height: 275px;
            --audio-tile-width: 275px;
            --audio-tile-min-height: 275px;
        }
    `;
}

function renderResultOptionsBar() {
    return css`
        #result-options-container {
            position: absolute;
            bottom: 0;
            left: 50px;
            right: 500px;
            height: 100px;

            display: flex;
            align-items: stretch;
            justify-content: center;
        }

        #result-options {
            border-radius: 20px;
            display: flex;
            flex-direction: row;
            background-color: var(--accent-color);
        }

        .option-section {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin: 0 30px;
            flex: auto;
        }

        .option-section > a {
            position: relative;
            margin: 0 10px;
            width: 40px;
            height: 40px;
            background-color: var(--font-color);

            cursor: pointer;
        }

        #import-files {
            width: 35px;
            height: 35px;
        }

        #create-song {
            width: 35px;
            height: 35px;
        }

        #active-track-warning {
            position: absolute;
            top: -50px;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            padding: 0 40px;

            background-color: var(--accent-color);
            color: orange;
            white-space: nowrap;
            font-weight: bold;
            font-size: 18px;
            cursor: pointer;

            display: inline-flex;
            align-items: center;
            justify-content: center;

            transition: opacity 1s ease;
        }

        #active-track-warning[invisible] {
            opacity: 0;
        }
    `;
}

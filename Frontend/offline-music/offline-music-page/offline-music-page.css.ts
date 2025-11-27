import { css } from 'lit';

export function renderOfflineMusicPageStyles() {
    return css`
        #online-link {
            position: absolute;
            left: 10px;
            top: 10px;
            height: 50px;
            width: 200px;
            border-radius: 10px;
            z-index: 1;

            background: #f0f3;
            backdrop-filter: blur(5px);

            display: flex;
            align-items: center;
            justify-content: center;

            font-weight: bold;
            letter-spacing: 1px;
            text-shadow: 0 0 5px black, 0 0 5px black;

            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
        }

        #music-page {
            position: absolute;
            inset: 20px;
            max-height: 1000px;
        }

        #search-panel-container {
            position: absolute;
            top: 0;
            right: 5px;
            z-index: 2;
            width: 300px;
            max-height: calc(100% - 50px);

            padding: 0 10px;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background-color: var(--accent-color);
            backdrop-filter: blur(10px);
            border-radius: 15px;
        }

        #draw-sidebar-icon {
            display: none;
        }

        #music-filter {
            flex: auto;
        }

        #result-count-label {
            font-size: 14px;
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

            border-radius: 15px;
        }

        #search-results-container {
            position: absolute;
            bottom: 80px;
            left: 0;
            right: 350px;
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
            width: 200px;
            min-height: 200px;
            --audio-tile-width: 200px;
            --audio-tile-min-height: 200px;
        }

        :host([selectionMode]) audio-tile {
            pointer-events: none;
        }
    `;
}

function renderResultOptionsBar() {
    return css`
        #result-options-container {
            position: absolute;
            bottom: 0;
            left: 50px;
            right: 350px;
            height: 60px;

            display: flex;
            justify-content: center;
        }

        #result-options {
            border-radius: 15px;
            display: flex;
            flex-direction: row;
            gap: 30px;
            padding: 0 20px;
            background-color: var(--accent-color);
        }

        .option-section {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            flex: auto;
        }

        .option-section > a {
            position: relative;
            margin: 0 10px;
            width: 30px;
            height: 30px;
            background-color: var(--font-color);

            cursor: pointer;
        }

        #import-files {
            width: 25px;
            height: 25px;
        }

        #create-song {
            width: 25px;
            height: 25px;
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

        range-slider {
            --background-color: #00000033;
            --slider-color: var(--secondary-color);
        }
    `;
}

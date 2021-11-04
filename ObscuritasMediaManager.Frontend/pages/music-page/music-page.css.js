import { css } from '../../exports.js';
import { cleanIcon } from '../../resources/icons/general/clean-icon.svg.js';
import { importIcon } from '../../resources/icons/import-icon.svg.js';
import { addPlaylistIcon } from '../../resources/icons/playlist-icons/add-playlist-icon.svg.js';
import { browsePlaylistIcon } from '../../resources/icons/playlist-icons/browse-playlist-icon.svg.js';
import { downloadPlaylistIcon } from '../../resources/icons/playlist-icons/download-playlist-icon.svg.js';
import { playPlaylistIcon } from '../../resources/icons/playlist-icons/play-playlist-icon.svg.js';
import { savePlaylistIcon } from '../../resources/icons/playlist-icons/save-playlist-icon.svg.js';
import { plusIcon } from '../../resources/icons/plus-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderMusicPageStyles() {
    return css`
        * {
            scrollbar-width: thin;
        }

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

            scrollbar-width: thin;
            scrollbar-color: var(--accent-color) #20625599;
            border-radius: 20px;
        }

        #search-results-container {
            position: absolute;
            bottom: 150px;
            left: 0;
            right: 500px;
            top: 0;
        }

        audio-tile {
            display: inline-block;
            position: relative;
            margin: 35px;
            width: 250px;
            min-height: 250px;
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
            ${renderMaskImage(importIcon(true))};
        }

        #create-song {
            width: 35px;
            height: 35px;
            ${renderMaskImage(plusIcon(true))};
        }

        #save-playlist {
            ${renderMaskImage(savePlaylistIcon())};
        }

        #add-to-playlist {
            ${renderMaskImage(addPlaylistIcon())};
        }

        #play-playlist {
            ${renderMaskImage(playPlaylistIcon())};
        }

        #browse-playlists {
            ${renderMaskImage(browsePlaylistIcon())};
        }

        #download-playlist {
            ${renderMaskImage(downloadPlaylistIcon())};
        }

        #cleanup-tracks {
            ${renderMaskImage(cleanIcon())};
        }
    `;
}

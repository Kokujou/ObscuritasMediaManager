import { css } from '../../exports.js';
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
        #music-page {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }

        #search-panel {
            position: absolute;
            top: 100px;
            right: 50px;
            width: 300px;
            bottom: 100px;

            display: flex;
            flex-direction: column;

            border: 1px solid white;
        }

        #search-panel > * {
            flex: auto;
        }

        #result-options-container {
            position: absolute;
            bottom: 0;
            left: 100px;
            right: 400px;
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
            background-color: lightseagreen;

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

        #search-results {
            position: absolute;
            bottom: 150px;
            left: 100px;
            right: 400px;
            top: 0;

            overflow-y: scroll;
            scrollbar-width: thin;
            scrollbar-color: #20625599 white;
            border: 1px solid white;
        }
    `;
}

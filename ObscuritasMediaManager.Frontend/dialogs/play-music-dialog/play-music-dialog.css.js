import { css, unsafeCSS } from '../../exports.js';
import { pauseIcon } from '../../resources/icons/music-player-icons/pause-icon.svg.js';
import { playIcon } from '../../resources/icons/music-player-icons/play-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { PlayMusicDialog } from './play-music-dialog.js';

export function renderPlayMusicDialogStyles() {
    return css`
        :host {
            position: fixed;
            right: 50px;
            bottom: 50px;
            width: 300px;
            height: 200px;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            color: white;

            animation-name: fade-in;
            animation-duration: ${unsafeCSS(PlayMusicDialog.FadeDuration)}s;
            animation-timing-function: linear;
        }

        :host([closing]) {
            opacity: 0;
            transition: opacity ${unsafeCSS(PlayMusicDialog.FadeDuration)}s linear;
        }

        @keyframes fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        #player {
            position: relative;
            flex: auto;
            cursor: pointer;
        }

        #play-button {
            position: absolute;
            width: 50px;
            height: 50px;
            translate: -50% -50%;
            left: 50%;
            top: 50%;
            background-color: white;
            ${renderMaskImage(pauseIcon())};
        }

        #play-button[paused] {
            ${renderMaskImage(playIcon())};
        }

        #close-button {
            position: absolute;
            top: 5px;
            right: 5px;
            font-size: 30px;
        }

        #position-slider {
            --background-color: #00000055;
            --slider-color: white;
            --thumb-size: 7px;
            --slider-height: 5px;
        }
    `;
}

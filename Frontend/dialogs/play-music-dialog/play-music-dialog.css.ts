import { css, unsafeCSS } from 'lit-element';
import { PlayMusicDialog } from './play-music-dialog';

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

            background: var(--primary-color);
            color: var(--font-color);
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

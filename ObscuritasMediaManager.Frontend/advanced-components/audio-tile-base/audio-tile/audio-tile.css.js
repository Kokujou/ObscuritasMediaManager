import { css } from '../../../exports.js';

export function renderAudioTileStyles() {
    return css`
        :host {
            display: inline-flex;
            flex-direction: column;
            position: relative;
        }

        ${renderMoodStyles()}

        #tile-container {
            position: relative;
            width: 100%;
            min-height: inherit;

            display: flex;
            flex-direction: column;
            align-items: stretch;
            justify-content: center;

            background: linear-gradient(#00000055 0% 100%), linear-gradient(var(--primary-color) 0% 100%);
            box-shadow: 0 0 50px var(--primary-color);
            border-radius: 20px;

            padding: 10px;

            user-select: none;
            cursor: pointer;
        }

        audio-tile-base {
            min-height: inherit;
            width: inherit;
            margin-bottom: 10px;
        }

        #tile-description {
            flex: auto;
            display: flex;
            flex-direction: column;
        }

        .inline-icon.unset {
            display: none;
        }

        #audio-title {
            font-size: 24px;
            text-align: center;

            overflow: hidden;
        }

        #audio-genre-section {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            max-height: 35px;

            margin-top: 10px;
            overflow: hidden;

            mask: linear-gradient(to bottom, black 0% 50%, transparent 100%);
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            transition: all 1s ease-out;
        }

        :host(:hover) #audio-genre-section {
            max-height: 150px;
            mask-size: 100% 300%;
        }

        #audio-genre-section * {
            margin-left: 5px;
            margin-bottom: 5px;
            z-index: 1;
            --label-color: var(--primary-color);
        }
    `;
}

function renderMoodStyles() {
    return css`
        #tile-container {
            --primary-color: #dddddd;
            --font-color: black;
            color: var(--font-color);
        }
        #tile-container.happy {
            --primary-color: #008000;
            --font-color: white;
        }
        #tile-container.aggressive {
            --primary-color: #a33000;
            --font-color: white;
        }
        #tile-container.sad {
            --primary-color: #0055a0;
            --font-color: white;
        }
        #tile-container.calm {
            --primary-color: #662200;
            --font-color: white;
        }
        #tile-container.romantic {
            --primary-color: #dd6677;
            --font-color: white;
        }
        #tile-container.dramatic {
            --primary-color: #333333;
            --font-color: white;
        }
        #tile-container.epic {
            --primary-color: #773399;
            --font-color: white;
        }
        #tile-container.funny {
            --primary-color: #a0a000;
            --font-color: white;
        }
        #tile-container.passionate {
            --primary-color: #bb6622;
            --font-color: white;
        }
        #tile-container.monotonuous {
            --primary-color: #999999;
            --font-color: black;
        }
    `;
}

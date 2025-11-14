import { css, unsafeCSS } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { Language } from '../../obscuritas-media-manager-backend-client';
import { unsetIcon } from '../../resources/inline-icons/general/unset-icon.svg';

export function renderRecipeTileStyles() {
    return css`
        :host {
            display: inline-block;
            width: var(--recipe-tile-width);
            min-width: var(--recipe-tile-width);
        }

        #content {
            width: var(--recipe-tile-width);
        }

        #image-container {
            position: relative;
            width: var(--recipe-tile-width);
            min-height: var(--recipe-tile-min-height);
        }

        #background-image {
            position: absolute;
            width: calc(100% - 50px);
            height: calc(100% - 100px);
            top: 50%;
            left: 25px;
            transform: translateY(-50%);

            background-repeat: no-repeat;
            background-position: center center;
            background-size: 200%;

            filter: blur(15px);
            border-radius: 25%;
        }

        #remove-image-button,
        #image {
            position: absolute;
            left: 50px;
            width: calc(100% - 100px);
            max-height: calc(100% - 100px);
            top: 50%;
            transform: translateY(-50%);
            border-radius: 5px;
        }

        #remove-image-button {
            z-index: 1;
            opacity: 0;
            filter: drop-shadow(0 0 10px black);

            transition: opacity ease 0.15s;

            cursor: pointer;
        }

        #trash-icon {
            position: absolute;
            inset: 0;
            background: darkred;
            mask-size: 30%;
        }

        #image-container:hover #remove-image-button {
            opacity: 0.8;
        }

        upload-area {
            position: absolute;
            inset: 50px;
        }

        #rating {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        #difficulty {
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
        }

        #nation-icon {
            position: absolute;
            width: 15%;
            aspect-ratio: 1;

            top: 10px;
            right: 10px;
            border-radius: 50%;

            cursor: pointer;
        }

        #nation-icon[nation='${unsafeCSS(Language.Unset)}'] {
            ${renderMaskImage(unsetIcon())};
            background: gray;
        }

        #technique-icon {
            top: 60px;
            right: 10px;
        }

        #ingredient-icon {
            top: 110px;
            right: 10px;
        }
        #course-icon {
            top: 160px;
            right: 10px;
        }

        #total-time {
            position: absolute;
            top: 70px;
            right: 10px;
        }

        #text-container {
            margin-top: 10px;
            font-size: 18px;
            font-weight: normal;
        }

        #recipe-title {
            font-weight: bold;
            font-size: 16px;
            text-overflow: ellipsis;
            max-width: 100%;
            overflow: hidden;
        }
    `;
}

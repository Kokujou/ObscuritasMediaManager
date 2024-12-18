import { css, unsafeCSS } from 'lit-element';
import { Language } from '../../obscuritas-media-manager-backend-client';
import { unsetIcon } from '../../resources/inline-icons/general/unset-icon.svg';
import { renderMaskImage } from '../../services/extensions/style.extensions';

export function renderRecipeTileStyles() {
    return css`
        #image-container {
            position: relative;
            width: var(--recipe-tile-width);
            min-height: var(--recipe-tile-min-height);
        }

        #image {
            position: absolute;
            inset: 0;
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
            font-size: 24px;
        }
    `;
}

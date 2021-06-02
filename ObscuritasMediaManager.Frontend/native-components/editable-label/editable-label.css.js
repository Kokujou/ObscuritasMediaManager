import { css } from '../../exports.js';
import { editIcon } from '../../pages/media-detail-page/images/edit-icon.svg.js';
import { saveTickIcon } from '../../resources/icons/general/save-tick-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderEditableLabelStyles() {
    return css`
        #editable-label {
            position: relative;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .icon {
            width: 30px;
            height: 30px;
            background-color: var(--font-color, black);

            cursor: pointer;
            margin-left: 10px;
        }

        #edit-icon {
            ${renderMaskImage(editIcon())};
        }

        #save-icon {
            ${renderMaskImage(saveTickIcon())};
        }

        #invisile-text {
            opacity: 0;
        }

        #value-input {
            outline: none;
            font: inherit;
            border-bottom: 1px solid;
            padding: 10px;
        }
    `;
}

import { css } from '../../exports.js';
import { editIcon } from '../../pages/media-detail-page/images/edit-icon.svg.js';
import { crossIcon } from '../../resources/icons/general/cross-icon.svg.js';
import { saveTickIcon } from '../../resources/icons/general/save-tick-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderEditableLabelStyles() {
    return css`
        :host {
            --default-label-height: var(--label-height, 35px);
        }

        #editable-label {
            position: relative;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }

        .icon {
            min-height: var(--default-label-height);
            min-width: var(--default-label-height);
            max-height: var(--default-label-height);
            max-width: var(--default-label-height);
            background-color: var(--font-color, black);

            cursor: pointer;
            margin: var(--text-padding);
        }

        #edit-icon {
            ${renderMaskImage(editIcon())};
        }

        #save-icon {
            ${renderMaskImage(saveTickIcon())};
        }

        #abort-icon {
            ${renderMaskImage(crossIcon())};
        }

        #invisile-text {
            opacity: 0;
        }

        #value-input {
            outline: none;
            font: inherit;
            border-bottom: 1px solid;

            overflow: auto;
            scrollbar-width: none;
            flex: auto;
        }

        #value-label {
            overflow: hidden;
            flex: auto;
        }

        #value-input,
        #value-label {
            text-overflow: ellipsis;
            white-space: nowrap;
            height: var(--default-label-height);
            max-width: 100%;

            display: flex;
            align-items: center;
            padding: var(--text-padding);
        }
    `;
}

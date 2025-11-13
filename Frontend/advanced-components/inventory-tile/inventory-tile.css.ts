import { css } from 'lit-element';
import { renderMaskImage } from '../../extensions/style.extensions';
import { editIcon } from '../../pages/media-detail-page/images/edit-icon.svg';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg';
import { saveTickIcon } from '../../resources/inline-icons/general/save-tick-icon.svg';

export function renderInventoryTileStyles() {
    return css`
        :host {
            display: flex;
        }

        #inventory-tile {
            max-width: 100%;
            padding: 20px;

            border-radius: 20px;

            align-items: center;
            gap: 20px;

            color: rgba(0, 0, 0, 0.72);
            text-shadow: 1px 1px 0 #ffffff;

            background: linear-gradient(
                -72deg,
                #dedede,
                #ffffff 16%,
                #dedede 21%,
                #ffffff 24%,
                #898989 30%,
                #dedede 36%,
                #ffffff 45%,
                #ffffff 60%,
                #dedede 72%,
                #ffffff 80%,
                #dedede 84%,
                #a1a1a1
            );
            border: 2px solid #cacade;

            box-shadow: 4px 4px 1em rgba(122, 122, 122, 0.55), inset 2px 2px 0 rgba(255, 255, 255, 0.9),
                inset -2px -2px 0 rgba(0, 0, 0, 0.5);
        }

        #drag-indicator {
            cursor: pointer;
            user-select: none;
        }

        #item-name {
            width: 100%;
            pointer-events: none;
        }

        #item-amount {
            width: 150px;
            margin-right: 20px;
        }

        input {
            background: none;
            margin: 0;
            padding: 0;
            border: 0;
            outline: 0;

            border-bottom: 2px solid white;
            color: white;
            font: inherit;
        }

        drop-down {
            flex: auto;
        }

        .action-icon {
            width: 30px;
            height: 30px;

            cursor: pointer;
            user-select: none;
        }

        #accept-icon {
            background: green;
            ${renderMaskImage(saveTickIcon())};
        }

        #edit-icon {
            width: 20px;
            height: 20px;

            margin-left: 10px;
            background: #333;
            ${renderMaskImage(editIcon())};
        }

        #delete-icon {
            background: red;
            ${renderMaskImage(trashIcon())};
        }

        #accept-icon[disabled] {
            pointer-events: none;
            background-color: gray;
        }
    `;
}

import { css } from 'lit';
import { renderMaskImage } from '../../extensions/style.extensions';
import { editIcon } from '../../pages/media-detail-page/images/edit-icon.svg';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg';
import { crossIcon } from '../../resources/inline-icons/general/cross-icon.svg';
import { saveTickIcon } from '../../resources/inline-icons/general/save-tick-icon.svg';

export function renderInventoryTileStyles() {
    return css`
        :host {
            display: flex;
            user-select: none;
            -webkit-user-select: none;
        }

        #inventory-tile {
            max-width: 100%;
            padding: 15px;

            border-radius: 20px;

            align-items: center;
            gap: 10px;

            color: rgba(0, 0, 0, 0.72);
            text-shadow: 1px 1px 0 #ffffff;

            background: var(--metallic-silver);
            box-shadow: var(--metallic-silver-shadow);
            border: 2px solid #cacade;
        }

        #inventory-tile:not([edit]) {
            cursor: grab;
        }

        #drag-indicator {
            cursor: pointer;
            user-select: none;
        }

        #item-name {
            width: 100%;
            box-sizing: border-box;
        }

        input#item-name {
            pointer-events: all;
        }

        #amount-row {
            flex-direction: flex-end;
        }

        #item-amount {
            width: 80px;
            margin-right: 20px;
        }

        input {
            background: none;
            margin: 0;
            border: 0;
            outline: 0;
            padding: 5px;

            color: inherit;
            font: inherit;
            border-bottom: 2px solid #0003;
        }

        drop-down {
            flex: auto;
        }

        .action-icon {
            width: 20px;
            height: 20px;

            cursor: pointer;
            user-select: none;
        }

        #actions {
            gap: 10px;
            margin-left: 10px;
        }

        #accept-icon {
            background: green;
            ${renderMaskImage(saveTickIcon())};
        }

        #cancel-icon {
            background: red;
            width: 18px;
            height: 18px;
            ${renderMaskImage(crossIcon())};
        }

        #edit-icon {
            width: 20px;
            height: 20px;

            cursor: pointer;
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

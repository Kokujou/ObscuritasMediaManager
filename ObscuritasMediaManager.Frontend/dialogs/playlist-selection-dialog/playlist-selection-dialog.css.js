import { css } from '../../exports.js';
import { popupIcon } from '../../resources/icons/general/popup-icon.svg.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';

export function renderPlaylistSelectionDialogStyles() {
    return css`
        table {
            width: 800px;
            color: white;
            border-collapse: collapse;
            table-layout: fixed;
        }

        th {
            text-align: left;
        }

        tr:not(.head-row):hover {
            background: #666a;
        }

        tr:not(.head-row):active {
            background: #bbba;
        }

        tr[selected] {
            background: #999a !important;
        }

        td,
        th {
            padding: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .name-column {
            width: 300px;
        }

        .rating-column {
            width: 150px;
            text-align: center;
        }

        star-rating {
            --font-size: 20px;
            pointer-events: none;
        }

        .popup-icon {
            width: 30px;
            height: 30px;
            background: white;

            ${renderMaskImage(popupIcon())};
        }
    `;
}

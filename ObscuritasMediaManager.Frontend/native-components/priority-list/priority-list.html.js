import { html } from '../../exports.js';
import { trashIcon } from '../../pages/media-detail-page/images/trash-icon.svg.js';
import { dragIcon } from '../../resources/icons/general/drag-icon.svg.js';
import { sortBy } from '../../services/extensions/array.extensions.js';
import { renderMaskImage } from '../../services/extensions/style.extensions.js';
import { PriorityList } from './priority-list.js';

/**
 * @param { PriorityList } priorityList
 */
export function renderPriorityList(priorityList) {
    return html` <style>
            .item {
                position: relative;
                display: flex;
                flex-direction: row;
                margin: 0 60px;
            }

            .icon {
                position: absolute;
                background: white;
                height: 100%;
                mask-size: 60% !important;

                cursor: pointer;

                aspect-ratio: 1 / 1;
            }

            .move-icon {
                left: -20px;
                transform: translateX(-100%);
                cursor: move;
            }

            .delete-icon {
                right: -20px;
                transform: translateX(100%);
                background: darkred;
            }

            tr.dragged-over,
            tr.overlayed {
                opacity: 0;
            }

            #dragged-element {
                position: fixed;
                pointer-events: none;
            }
        </style>

        <style>
            .delete-icon {
                ${renderMaskImage(trashIcon())};
            }
            .move-icon {
                ${renderMaskImage(dragIcon())};
            }
        </style>
        ${sortBy(priorityList.items, (x) => x.order).map((item, index) => {
            item.order = index;
            return html`
                <div class="item" order="${index}">
                    <div
                        class="move-icon icon"
                        draggable="true"
                        @dragstart="${(e) => priorityList.registerDragItem(e, index)}"
                    ></div>
                    ${priorityList.itemRenderer(item)}
                    <div class="delete-icon icon" @click="${() => priorityList.dispatchCustomEvent('delete-item', item)}"></div>
                </div>
            `;
        })}`;
}
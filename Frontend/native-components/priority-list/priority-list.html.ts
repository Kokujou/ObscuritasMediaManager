import { html } from 'lit-element';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { sortBy } from '../../services/extensions/array.extensions';
import { PriorityList } from './priority-list';

export function renderPriorityList(this: PriorityList) {
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

        ${sortBy(this.items, (x) => x.order).map((item, index) => {
            item.order = index;
            return html`
                <div class="item" order="${index}">
                    <div
                        class="move-icon icon"
                        icon="${Icons.Drag}"
                        draggable="true"
                        @dragstart="${(e: DragEvent) => this.registerDragItem(e, index)}"
                    ></div>
                    ${this.itemRenderer(item)}
                    <div class="icon" icon="${Icons.Trash}" @click="${() => this.notifyDeleteItem(item)}"></div>
                </div>
            `;
        })}`;
}
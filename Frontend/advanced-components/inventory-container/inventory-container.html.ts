import { html } from 'lit-element';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { InventoryTarget } from '../../obscuritas-media-manager-backend-client';
import { InventoryContainer } from './inventory-container';

export function renderInventoryContainer(this: InventoryContainer) {
    const maxLevel = Math.max(...this.items.filter((x) => x.target == this.target && !x.isSide).map((x) => x.level!), -1);
    const maxSideLevel = Math.max(...this.items.filter((x) => x.target == this.target && x.isSide).map((x) => x.level!), -1);

    return html`
        <flex-column id="content" ?dragging="${!!this.draggedItem}">
            <drop-down
                id="container-caption"
                .caption="${this.target}"
                .options="${DropDownOption.createSimpleArray([InventoryTarget.Freezer, InventoryTarget.Fridge], this.target)}"
                @selectionChange="${(e: CustomEvent<{ option: DropDownOption<InventoryTarget> }>) =>
                    (this.target = e.detail.option.value)}"
            ></drop-down>
            <flex-row id="container">
                <flex-column id="side-levels" class="levels">
                    ${Array.createRange(0, maxSideLevel + 1).map((level) => renderLevel.call(this, level, true))}
                </flex-column>
                <flex-column id="main-levels" class="levels">
                    ${Array.createRange(0, maxLevel + 1).map((level) => renderLevel.call(this, level, false))}
                </flex-column>
            </flex-row>
        </flex-column>
    `;
}

function renderLevel(this: InventoryContainer, level: number, isSide: boolean) {
    return html`<flex-row
        class="level"
        dropzone="move"
        ?dragged-over="${this.draggedOverLevel == level && this.draggedOverSide == isSide}"
        @dragover="${(e: Event) => this.dragOverLevel(e, level, isSide)}"
        @dragleave="${(e: Event) => this.dragOverLevel(e, undefined)}"
        @drop="${this.moveItem}"
    >
        <label class="level-label">${level}</label>
        ${this.items
            .filter((x) => x.target == this.target && x.level == level && x.isSide == isSide)
            .map(
                (item) =>
                    html` <inventory-tile
                        draggable="true"
                        .item="${item}"
                        @dragstart="${(e: DragEvent) => this.startDraggingItem(e, item)}"
                    ></inventory-tile>`
            )}
        <div class="plus-icon" @click="${() => this.addItem(level, isSide)}"></div>

        <flex-row class="drag-actions" @dragleave="${(e: Event) => e.stopPropagation()}">
            <div
                class="drag-action-button"
                dropzone="move"
                @dragover="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', true)}"
                @dragleave="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', false)}"
                @drop="${() => this.notifyDraggedItemDuplicated(1)}"
            >
                x1
            </div>
            <div
                class="drag-action-button"
                dropzone="move"
                @dragover="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', true)}"
                @dragleave="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', false)}"
                @drop="${() => this.notifyDraggedItemDuplicated(2)}"
            >
                x2
            </div>
            <div
                class="drag-action-button"
                dropzone="move"
                @dragover="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', true)}"
                @dragleave="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', false)}"
                @drop="${() => this.notifyDraggedItemDuplicated(3)}"
            >
                x3
            </div>
            <div
                class="delete-button"
                dropzone="move"
                @dragover="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', true)}"
                @dragleave="${(e: Event) => (e.currentTarget as HTMLElement).toggleAttribute('dragged-over', false)}"
                @drop="${() => this.notifyDraggedItemDeleted()}"
            >
                <div class="delete-icon"></div>
            </div>
        </flex-row>
    </flex-row>`;
}

import { html } from 'lit-element';
import { InventoryContainer } from './inventory-container';

export function renderInventoryContainer(this: InventoryContainer) {
    const maxLevel = Math.max(...this.items.map((x) => x.level!), -1);

    return html`
        <flex-column id="content">
            <div id="container-caption">${this.target}</div>
            <flex-column id="levels">
                ${Array.createRange(0, maxLevel + 1).map(
                    (level) =>
                        html`<flex-column
                            class="level"
                            dropzone="move"
                            ?dragged-over="${this.draggedOverLevel == level}"
                            @dragover="${(e: Event) => this.dragOverLevel(e, level)}"
                            @dragleave="${(e: Event) => this.dragOverLevel(e, undefined)}"
                            @drop="${this.moveItem}"
                        >
                            ${this.items
                                .filter((x) => x.level == level)
                                .map(
                                    (item) =>
                                        html`<inventory-tile
                                            draggable="true"
                                            .item="${item}"
                                            @dragstart="${(e: DragEvent) => this.startDraggingItem(e, item)}"
                                        ></inventory-tile>`
                                )}
                            <div class="plus-icon" @click="${() => this.addItem(level)}">+ Neuer Eintrag</div>
                        </flex-column>`
                )}
            </flex-column>
        </flex-column>
    `;
}

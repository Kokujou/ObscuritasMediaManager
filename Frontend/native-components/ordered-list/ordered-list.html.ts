import { html } from 'lit-element';
import { OrderedList } from './ordered-list';

export function renderOrderedList(this: OrderedList) {
    return html`
        <div id="list" @dragleave="${this.handleDragLeave}">
            ${this.items.map(
                (item, index) => html`<div
                    class="row"
                    index="${index}"
                    ?dragTarget="${index.toString() == this.lastHovered?.getAttribute('index')}"
                    ?active="${this.selectedIndices.includes(index)}"
                    @click="${(e: MouseEvent) => this.handleRowClick(e, index)}"
                    @dragover="${(e: Event) => {
                        if (!this.dragged) return;

                        e.stopPropagation();
                        e.preventDefault();
                        this.lastHovered = e.currentTarget as HTMLInputElement;
                        this.requestFullUpdate();
                    }}"
                    @dragstart="${(e: Event) => (this.dragged = e.currentTarget as HTMLInputElement)}"
                    draggable="true"
                >
                    <div class="index-column column">${index + 1}</div>
                    <div class="value-column column">${item[this.propertyName]}</div>
                </div>`
            )}
        </div>
    `;
}

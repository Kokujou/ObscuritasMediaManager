import { html } from 'lit-element';
import { OrderedList } from './ordered-list';

/**
 * @param { OrderedList } list
 */
export function renderOrderedList(list: OrderedList) {
    return html`
        <div id="list" @dragleave="${list.handleDragLeave}">
            ${list.items.map(
                (item, index) => html`<div
                    class="row"
                    index="${index}"
                    ?dragTarget="${index.toString() == list.lastHovered?.getAttribute('index')}"
                    ?active="${list.selectedIndices.includes(index)}"
                    @click="${(e: Event) => list.handleRowClick(e, index)}"
                    @dragover="${(e: Event) => {
                        if (!list.dragged) return;

                        e.stopPropagation();
                        e.preventDefault();
                        list.lastHovered = e.currentTarget as HTMLInputElement;
                        list.requestFullUpdate();
                    }}"
                    @dragstart="${(e: Event) => (list.dragged = e.currentTarget as HTMLInputElement)}"
                    draggable="true"
                >
                    <div class="index-column column">${index + 1}</div>
                    <div class="value-column column">${item[list.propertyName]}</div>
                </div>`
            )}
        </div>
    `;
}

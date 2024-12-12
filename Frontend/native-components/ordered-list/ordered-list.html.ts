import { html } from 'lit-element';
import { OrderedList } from './ordered-list';

/**
 * @param { OrderedList } list
 */
export function renderOrderedList(list) {
    return html`
        <div id="list" @dragleave="${list.handleDragLeave}">
            ${list.items.map(
                (item, index) => html`<div
                    class="row"
                    index="${index}"
                    ?dragTarget="${index.toString() == list.lastHovered?.getAttribute('index')}"
                    ?active="${list.selectedIndices.includes(index)}"
                    @click="${(e) => list.handleRowClick(e, index)}"
                    @dragover="${(e) => {
                        if (!list.dragged) return;

                        e.stopPropagation();
                        e.preventDefault();
                        list.lastHovered = e.currentTarget;
                        list.requestFullUpdate();
                    }}"
                    @dragstart="${(e) => (list.dragged = e.currentTarget)}"
                    draggable="true"
                >
                    <div class="index-column column">${index + 1}</div>
                    <div class="value-column column">${item[list.propertyName]}</div>
                </div>`
            )}
        </div>
    `;
}

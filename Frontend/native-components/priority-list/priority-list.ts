import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { sortBy } from '../../services/extensions/array.extensions';
import { cloneElementAsFixed, findElementIndexMatchingCursorY } from '../../services/extensions/document.extensions';
import { minmax } from '../../services/extensions/math.extensions';
import { renderPriorityList } from './priority-list.html';

/**
 * @typedef {{order: number}} PriorityListItem
 */

@customElement('priority-list')
export class PriorityList extends LitElementBase {
    static get properties() {
        return {
            items: { type: Array, reflect: true },
            itemRenderer: { type: Object, reflect: true },
        };
    }

    createRenderRoot() {
        return this;
    }

    constructor() {
        super();

        /** @type {PriorityListItem[]} */ this.items;
        /** @type {(item: PriorityListItem) => TemplateResult} */ this.itemRenderer;

        /** @type {PriorityListItem[]} */ this.oldEntries = [];
        this.currentlyDraggedOverItemIndex = 0;
        this.currentlyDraggedItemIndex = 0;
        this.draggedElement = null;
        document.addEventListener('dragover', (e) => this.handleItemMove(e), { signal: this.abortController.signal });

        document.addEventListener('dragend', () => this.handleItemDrop(), { signal: this.abortController.signal });
    }

    override render() {
        return renderPriorityList(this);
    }

    /**
     *
     * @param {DragEvent} event
     * @param {number} index
     */
    registerDragItem(event, index) {
        this.oldEntries = [...this.items];

        event.dataTransfer.setData('text/html', null);
        event.dataTransfer.setDragImage(new Image(), 0, 0);

        /** @type {HTMLElement} */ var selectedElement = this.querySelector(`.item[order='${index}']`);

        var clonedElement = cloneElementAsFixed(selectedElement);
        clonedElement.id = 'dragged-element';
        selectedElement.parentElement.append(clonedElement);
        this.draggedElement = clonedElement;

        selectedElement.classList.add('overlayed');
        this.currentlyDraggedItemIndex = index;
        this.requestFullUpdate();
    }

    /**
     *
     * @param {DragEvent} event
     */
    handleItemMove(event) {
        if (this.currentlyDraggedItemIndex < 0) return;
        event.preventDefault();
        var items = this.querySelectorAll('.item');
        var draggedOverIndex = findElementIndexMatchingCursorY(event.pageY, items);

        var targetBoundingRect = items[draggedOverIndex].getBoundingClientRect();
        this.draggedElement.style.top = `${minmax(event.pageY, targetBoundingRect.top, targetBoundingRect.bottom)}px`;

        this.switchWithDragged(draggedOverIndex);
    }

    handleItemDrop() {
        if (!this.draggedElement) return;
        this.draggedElement.remove();

        var selectedElement = this.querySelector(`.item[order='${this.currentlyDraggedItemIndex}']`);

        if (!selectedElement.classList) return;

        selectedElement.classList.remove('overlayed');

        this.currentlyDraggedItemIndex = -1;
        this.currentlyDraggedOverItemIndex = -1;
        //    this.notifyListChanged();
    }

    /**
     *
     * @param {number} index1
     * @param {number} index2
     */
    switchItems(index1, index2) {
        this.items[index1].order = index2;
        this.items[index2].order = index1;
        this.items = sortBy(this.items, (x) => x.order);
    }

    /**
     * @param {number} index
     */
    switchWithDragged(index) {
        if (
            this.currentlyDraggedItemIndex < 0 ||
            index < 0 ||
            index == this.currentlyDraggedItemIndex ||
            index >= this.items.length
        )
            return;
        this.currentlyDraggedOverItemIndex = index;
        this.switchItems(this.currentlyDraggedItemIndex, index);

        var oldSelectedElement = this.querySelector(`.item[order='${this.currentlyDraggedItemIndex}']`);
        oldSelectedElement.classList.remove('overlayed');

        this.currentlyDraggedItemIndex = index;
        this.requestFullUpdate();
    }
}

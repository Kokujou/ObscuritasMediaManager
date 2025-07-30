import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';

import { cloneElementAsFixed, findElementIndexMatchingCursorY } from '../../extensions/document.extensions';
import { minmax } from '../../extensions/math.extensions';
import { renderPriorityList } from './priority-list.html';

type PriorityListItem = { order: number };

@customElement('priority-list')
export class PriorityList extends LitElementBase {
    createRenderRoot() {
        return this;
    }

    @property({ type: Array }) public declare items: PriorityListItem[];
    @property({ type: Object }) public declare itemRenderer: (item: any) => unknown;

    @state() protected declare oldEntries: any[];
    @state() protected declare currentlyDraggedOverItemIndex: number;
    @state() protected declare currentlyDraggedItemIndex: number;
    @state() protected declare draggedElement?: HTMLElement;

    constructor() {
        super();
        this.oldEntries = [];

        document.addEventListener('dragover', (e) => this.handleItemMove(e), { signal: this.abortController.signal });
        document.addEventListener('dragend', () => this.handleItemDrop(), { signal: this.abortController.signal });
    }

    override render() {
        return renderPriorityList.call(this);
    }

    registerDragItem(event: DragEvent, index: number) {
        this.oldEntries = [...this.items];

        event.dataTransfer!.setData('text/html', null!);
        event.dataTransfer!.setDragImage(new Image(), 0, 0);

        var selectedElement = this.querySelector<HTMLElement>(`.item[order='${index}']`)!;

        var clonedElement = cloneElementAsFixed(selectedElement);
        clonedElement.id = 'dragged-element';
        selectedElement.parentElement?.append(clonedElement);
        this.draggedElement = clonedElement;

        selectedElement.classList.add('overlayed');
        this.currentlyDraggedItemIndex = index;
        this.requestFullUpdate();
    }

    handleItemMove(event: DragEvent) {
        if (this.currentlyDraggedItemIndex < 0 || !this.draggedElement) return;

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

        var selectedElement = this.querySelector(`.item[order='${this.currentlyDraggedItemIndex}']`)!;

        if (!selectedElement.classList) return;

        selectedElement.classList.remove('overlayed');

        this.dispatchEvent(new CustomEvent('list-changed'));
        this.currentlyDraggedItemIndex = -1;
        this.currentlyDraggedOverItemIndex = -1;
    }

    switchItems(index1: number, index2: number) {
        this.items[index1].order = index2;
        this.items[index2].order = index1;
        this.items = this.items.orderBy((x) => x.order);
    }

    switchWithDragged(index: number) {
        if (
            this.currentlyDraggedItemIndex < 0 ||
            index < 0 ||
            index == this.currentlyDraggedItemIndex ||
            index >= this.items.length
        )
            return;
        this.currentlyDraggedOverItemIndex = index;
        this.switchItems(this.currentlyDraggedItemIndex, index);

        var oldSelectedElement = this.querySelector(`.item[order='${this.currentlyDraggedItemIndex}']`)!;
        oldSelectedElement.classList.remove('overlayed');

        this.currentlyDraggedItemIndex = index;
        this.requestFullUpdate();
    }

    notifyDeleteItem(item: any) {
        this.dispatchEvent(new CustomEvent('delete-item', { detail: item }));
    }
}

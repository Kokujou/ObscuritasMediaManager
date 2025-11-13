import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { InventoryItemModel, InventoryTarget } from '../../obscuritas-media-manager-backend-client';
import { renderInventoryContainerStyles } from './inventory-container.css';
import { renderInventoryContainer } from './inventory-container.html';

@customElement('inventory-container')
export class InventoryContainer extends LitElementBase {
    static override get styles() {
        return renderInventoryContainerStyles();
    }

    @property() public declare target: InventoryTarget;
    @property({ type: Array }) public declare items: InventoryItemModel[];

    @state() protected declare draggedItem: InventoryItemModel | undefined;
    @state() protected declare draggedOverLevel: number | undefined;

    override render() {
        return renderInventoryContainer.call(this);
    }

    addItem(level: number) {
        this.items.push(new InventoryItemModel({ level: level, target: this.target }));
        this.requestFullUpdate();
    }

    startDraggingItem(event: DragEvent, item: InventoryItemModel) {
        this.draggedItem = item;
        console.log(event.dataTransfer);
        event.dataTransfer!.setData('text/plain', 'test');
        event.dataTransfer!.setDragImage((event.currentTarget as HTMLElement).shadowRoot?.firstElementChild!, 0, 0);
    }

    dragOverLevel(e: Event, level: number | undefined) {
        if (!this.draggedItem) return;
        e.preventDefault();
        this.draggedOverLevel = level;
    }

    moveItem() {
        if (!this.draggedOverLevel && this.draggedOverLevel != 0) return;
        if (!this.draggedItem) return;

        const draggedItem = this.draggedItem;
        const draggedOverLevel = this.draggedOverLevel;
        this.draggedItem = undefined;
        this.draggedOverLevel = undefined;

        if (draggedOverLevel == draggedItem.level) return;
        draggedItem.level = draggedOverLevel;

        this.dispatchEvent(new CustomEvent('item-changed', { detail: draggedItem, bubbles: true, composed: true }));
    }
}

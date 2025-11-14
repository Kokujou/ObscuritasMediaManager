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

    @property({ type: Array }) public declare items: InventoryItemModel[];

    @state() protected declare draggedItem: InventoryItemModel | undefined;
    @state() protected declare draggedOverLevel: number | undefined;
    @state() protected declare draggedOverSide: boolean;
    @state() protected declare target: InventoryTarget;

    connectedCallback(): void {
        super.connectedCallback();
        this.target = InventoryTarget.Freezer;
        window.addEventListener('pointerup', this.cancelDrag.bind(this));
        window.addEventListener('drop', this.cancelDrag.bind(this));
        this.addEventListener(
            'touchmove',
            function (e) {
                e.stopPropagation();
            },
            { passive: false }
        );
    }

    override render() {
        return renderInventoryContainer.call(this);
    }

    addItem(level: number, isSide: boolean) {
        this.items.push(new InventoryItemModel({ level: level, isSide, target: this.target }));
        this.requestFullUpdate();
    }

    startDraggingItem(event: DragEvent, item: InventoryItemModel) {
        this.draggedItem = item;
        event.dataTransfer!.setData('application/plain', 'test');
        event.dataTransfer!.setDragImage((event.currentTarget as HTMLElement).shadowRoot?.firstElementChild!, 0, 0);
    }

    dragOverLevel(e: Event, level?: number, isSide?: boolean) {
        if (!this.draggedItem) return;
        e.preventDefault();
        this.draggedOverLevel = level;
        this.draggedOverSide = isSide ?? false;
    }

    moveItem() {
        if (!this.draggedOverLevel && this.draggedOverLevel != 0) return;
        if (!this.draggedItem) return;

        const draggedItem = this.draggedItem;
        const draggedOverLevel = this.draggedOverLevel;
        this.draggedItem = undefined;
        this.draggedOverLevel = undefined;

        if (draggedOverLevel == draggedItem.level && this.draggedOverSide == draggedItem.isSide) return;
        draggedItem.level = draggedOverLevel;
        draggedItem.isSide = this.draggedOverSide;

        this.dispatchEvent(new CustomEvent('item-changed', { detail: draggedItem, bubbles: true, composed: true }));
    }

    notifyDraggedItemDeleted() {
        this.dispatchEvent(new CustomEvent('item-deleted', { detail: this.draggedItem, bubbles: true, composed: true }));
    }

    cancelDrag() {
        this.draggedItem = undefined;
        this.draggedOverLevel = undefined;
        this.shadowRoot!.querySelector('.delete-button[dragged-over]')?.removeAttribute('dragged-over');
    }

    notifyDraggedItemDuplicated(times: number) {
        this.dispatchEvent(
            new CustomEvent('multiply-item', {
                detail: { itemId: this.draggedItem?.itemId, times },
                bubbles: true,
                composed: true,
            })
        );
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener('pointerup', this.cancelDrag);
    }
}

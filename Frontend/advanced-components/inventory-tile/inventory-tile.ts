import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { InventoryItemModel } from '../../obscuritas-media-manager-backend-client';
import { renderInventoryTileStyles } from './inventory-tile.css';
import { renderInventoryTile } from './inventory-tile.html';

@customElement('inventory-tile')
export class InventoryTile extends LitElementBase {
    static override get styles() {
        return renderInventoryTileStyles();
    }

    @property({ type: Object }) public declare item: InventoryItemModel;

    @state() protected declare editAmount: boolean;

    get createMode() {
        return !this.item.itemId;
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener('dragstart', (e: Event) => {
            if (!this.item.itemId || this.editAmount) {
                e.stopImmediatePropagation();
                e.preventDefault();
            }
        });
    }

    override render() {
        this.draggable = !this.createMode && !this.editAmount;
        return renderInventoryTile.call(this);
    }

    updateAmount(input: HTMLInputElement) {
        this.enforceNumbers(input);

        this.item.quantity = Number.parseFloat(input.value);
        this.requestFullUpdate();
    }

    enforceNumbers(input: HTMLInputElement) {
        if (input.value.startsWith('.')) {
            input.value = '';
            return;
        }

        while (input.value.startsWith('0')) input.value = input.value.substring(1);

        input.value = input.value
            .replaceAll(',', '.')
            .replaceAll(/[^0-9\.]/g, '')
            .replaceAll('..', '.');

        const dotCount = [...input.value].filter((x) => x == '.').length;
        const firstDotIndex = input.value.indexOf('.');
        if (dotCount > 1) input.value = [...input.value].filter((char, index) => char != '.' || index == firstDotIndex).join('');
    }

    notifyItemCreated() {
        if (this.createMode)
            this.dispatchEvent(new CustomEvent('item-added', { detail: this.item, bubbles: true, composed: true }));
        else if (this.editAmount)
            this.dispatchEvent(new CustomEvent('item-changed', { detail: this.item, bubbles: true, composed: true }));
        this.editAmount = false;
    }

    cancelEdit() {
        this.editAmount = false;
        this.dispatchEvent(new CustomEvent('refresh', { bubbles: true, composed: true }));
    }
}

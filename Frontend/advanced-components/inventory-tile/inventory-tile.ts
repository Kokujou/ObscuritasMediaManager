import { customElement, property } from 'lit-element/decorators';
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

    override render() {
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
        this.dispatchEvent(new CustomEvent('item-added', { detail: this.item, bubbles: true, composed: true }));
    }

    notifyItemDeleted() {
        this.dispatchEvent(new CustomEvent('item-deleted', { detail: this.item, bubbles: true, composed: true }));
    }
}

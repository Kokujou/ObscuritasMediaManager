import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { newGuid } from '../../extensions/crypto.extensions';
import { InventoryItemModel } from '../../obscuritas-media-manager-backend-client';
import { InventoryService } from '../../services/backend.services';
import { renderInventoryPageStyles } from './inventory-page.css';
import { renderInventoryPage } from './inventory-page.html';

@customElement('inventory-page')
export class InventoryPage extends LitElementBase {
    static isPage = true as const;
    static pageName = 'Inventar' as const;

    static override get styles() {
        return renderInventoryPageStyles();
    }

    @state() protected declare inventory?: InventoryItemModel[];
    @state() protected declare loading: boolean;

    override render() {
        return renderInventoryPage.call(this);
    }

    async connectedCallback() {
        await super.connectedCallback();
        this.loading = true;
        await this.refreshInventory();
        this.loading = false;
    }

    async refreshInventory() {
        this.inventory = await InventoryService.getInventory();
    }

    async updateItem(item: InventoryItemModel) {
        await InventoryService.updateItem(item);
        await this.refreshInventory();
    }

    async createItem(item: InventoryItemModel) {
        item.itemId = newGuid();
        await InventoryService.addItem(item);
        await this.refreshInventory();
    }

    async multiplyItem(itemId: string, times: number) {
        await InventoryService.multiplyItem(itemId, times);
        await this.refreshInventory();
    }

    async deleteItem(item: InventoryItemModel) {
        await InventoryService.deleteItem(item.itemId);
        await this.refreshInventory();
    }
}

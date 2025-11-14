import { html } from 'lit';
import { InventoryItemModel, InventoryTarget } from '../../obscuritas-media-manager-backend-client';
import { InventoryPage } from './inventory-page';

export function renderInventoryPage(this: InventoryPage) {
    if (this.loading || !this.inventory) return html`<page-layout><partial-loading hideText></partial-loading></page-layout>`;

    return html`
        <page-layout
            @item-added="${(e: CustomEvent<InventoryItemModel>) => this.createItem(e.detail)}"
            @multiply-item="${(e: CustomEvent<{ itemId: string; times: number }>) =>
                this.multiplyItem(e.detail.itemId, e.detail.times)}"
            @item-changed="${(e: CustomEvent<InventoryItemModel>) => this.updateItem(e.detail)}"
            @item-deleted="${(e: CustomEvent<InventoryItemModel>) => this.deleteItem(e.detail)}"
            @refresh="${() => this.refreshInventory()}"
        >
            <flex-column id="inventory-page">
                <inventory-container id="freezer" .items="${this.inventory}"></inventory-container>
                <div id="misc-section">
                    ${this.inventory
                        .filter((x) => x.target == InventoryTarget.Other)
                        .map((item) => html`<inventory-tile .item="${item}"></inventory-tile>`)}
                    <div class="add-button">+</div>
                </div>
            </flex-column>
        </page-layout>
    `;
}

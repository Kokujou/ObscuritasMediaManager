import { html } from 'lit-element';
import { InventoryItemModel, InventoryTarget } from '../../obscuritas-media-manager-backend-client';
import { InventoryPage } from './inventory-page';

export function renderInventoryPage(this: InventoryPage) {
    if (this.loading || !this.inventory) return html`<page-layout><partial-loading hideText></partial-loading></page-layout>`;

    return html`
        <page-layout
            @item-added="${(e: CustomEvent<InventoryItemModel>) => this.createItem(e.detail)}"
            @item-changed="${(e: CustomEvent<InventoryItemModel>) => this.updateItem(e.detail)}"
            @item-deleted="${(e: CustomEvent<InventoryItemModel>) => this.deleteItem(e.detail)}"
        >
            <flex-row id="container-section">
                <inventory-container
                    id="freezer"
                    target="${InventoryTarget.Freezer}"
                    .items="${this.inventory.filter((x) => x.target == InventoryTarget.Freezer)}"
                ></inventory-container>
                <inventory-container
                    id="fridge"
                    target="${InventoryTarget.Fridge}"
                    .items="${this.inventory.filter((x) => x.target == InventoryTarget.Fridge)}"
                ></inventory-container>
            </flex-row>
            <div id="misc-section">
                ${this.inventory
                    .filter((x) => x.target == InventoryTarget.Other)
                    .map((item) => html`<inventory-tile .item="${item}"></inventory-tile>`)}
                <div class="add-button">+</div>
            </div>
        </page-layout>
    `;
}

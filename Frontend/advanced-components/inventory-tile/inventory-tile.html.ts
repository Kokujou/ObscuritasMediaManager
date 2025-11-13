import { html } from 'lit-element';
import { MeasurementUnits } from '../../data/measurement-units';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { MeasurementUnit } from '../../obscuritas-media-manager-backend-client';
import { InventoryTile } from './inventory-tile';

export function renderInventoryTile(this: InventoryTile) {
    if (!this.item.itemId) return renderInventoryTileEditMode.call(this);

    return html`
        <flex-row id="inventory-tile">
            <div id="drag-indicator">⠿</div>
            <flex-column>
                <div id="ingredient-name">${this.item.ingredientName}</div>
                <flex-row center>
                    <div id="ingredient-amount">${this.item.quantity}${this.item.unit.shortName}</div>
                    <div id="edit-icon" class="action-icon"></div>
                </flex-row>
            </flex-column>
            <div id="delete-icon" class="action-icon" @click="${this.notifyItemDeleted}"></div>
        </flex-row>
    `;
}

function renderInventoryTileEditMode(this: InventoryTile) {
    return html`
        <flex-row id="inventory-tile">
            <div id="drag-indicator">⠿</div>
            <flex-column>
                <input
                    id="item-name"
                    type="text"
                    placeholder="Neues Item"
                    @change="${(e: Event) => {
                        this.item.ingredientName = (e.target as HTMLInputElement).value;
                        this.requestFullUpdate();
                    }}"
                />
                <flex-row>
                    <input
                        id="item-amount"
                        type="text"
                        placeholder="Menge"
                        maxlength="6"
                        @change="${(e: Event) => this.updateAmount(e.target as HTMLInputElement)}"
                        @input="${(e: Event) => e.target?.dispatchEvent(new Event('change'))}"
                    />
                    <drop-down
                        .options="${MeasurementUnits.map((unit) =>
                            DropDownOption.create({ category: unit.measurement, value: unit, text: unit.name })
                        )}"
                        caption="${this.item.unit?.name ?? '---'}"
                        @selectionChange="${(e: CustomEvent<{ option: DropDownOption<MeasurementUnit> }>) => {
                            this.item.unit = e.detail.option.value;
                            this.requestFullUpdate();
                        }}"
                    ></drop-down>
                </flex-row>
            </flex-column>
            <div
                id="accept-icon"
                class="action-icon"
                ?disabled="${!this.item.ingredientName || !this.item.quantity || !this.item.unit?.name}"
                @click="${this.notifyItemCreated}"
            ></div>
        </flex-row>
    `;
}

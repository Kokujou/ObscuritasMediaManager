import { html } from 'lit-element';
import { MeasurementUnits } from '../../data/measurement-units';
import { DropDownOption } from '../../native-components/drop-down/drop-down-option';
import { MeasurementUnit } from '../../obscuritas-media-manager-backend-client';
import { InventoryTile } from './inventory-tile';

export function renderInventoryTile(this: InventoryTile) {
    return html`
        <flex-row id="inventory-tile" ?new="${this.createMode}">
            ${this.createMode || this.editAmount ? null : html` <div id="drag-indicator">⠿</div> `}
            <flex-column>
                ${this.createMode
                    ? html`<input
                          id="item-name"
                          type="text"
                          placeholder="Neues Item"
                          @change="${(e: Event) => {
                              this.item.ingredientName = (e.target as HTMLInputElement).value;
                              this.requestFullUpdate();
                          }}"
                      />`
                    : html` <div id="ingredient-name">${this.item.ingredientName}</div> `}
                ${this.editAmount || this.createMode
                    ? html`<flex-row id="amount-row">
                          <input
                              id="item-amount"
                              type="text"
                              placeholder="Menge"
                              maxlength="6"
                              value="${this.item.quantity}"
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
                      </flex-row>`
                    : html`
                          <flex-row center>
                              <div id="ingredient-amount">${this.item.quantity}${this.item.unit.shortName}</div>
                              <div id="edit-icon" class="action-icon" @click="${() => (this.editAmount = true)}"></div>
                          </flex-row>
                      `}
            </flex-column>

            ${this.createMode || this.editAmount
                ? html` <flex-column id="actions">
                      <div
                          id="accept-icon"
                          class="action-icon"
                          ?disabled="${!this.item.ingredientName || !this.item.quantity || !this.item.unit?.name}"
                          @click="${this.notifyItemCreated}"
                      ></div>
                      <div
                          id="cancel-icon"
                          class="action-icon"
                          @click="${() => (this.createMode ? this.remove() : this.cancelEdit())}"
                      ></div>
                  </flex-column>`
                : null}
        </flex-row>
    `;
}

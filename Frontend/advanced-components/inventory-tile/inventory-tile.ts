import { customElement, property, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { MeasurementUnits } from '../../data/measurement-units';
import { waitForSeconds } from '../../extensions/animation.extension';
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

    protected declare pointerdownController: AbortController | undefined;

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

        window.addEventListener(
            'pointerup',
            () => {
                this.pointerdownController?.abort();
                if (this.pointerdownController) this.acceptChange();
                this.pointerdownController = undefined;
            },
            { signal: this.abortController.signal }
        );
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

    acceptChange() {
        if (this.createMode)
            this.dispatchEvent(new CustomEvent('item-added', { detail: this.item, bubbles: true, composed: true }));
        else this.dispatchEvent(new CustomEvent('item-changed', { detail: this.item, bubbles: true, composed: true }));
        this.editAmount = false;
    }

    async incrementAmount(signal: AbortSignal, iteration = 1) {
        const nearestPower10 = Math.max(Math.pow(10, Math.floor(Math.log10(this.item.quantity / 3))), 1);
        const relatedUnits = MeasurementUnits.filter((x) => x.measurement == this.item.unit.measurement)
            .orderBy((x) => x.multiplier)
            .reverse();
        const currentUnitIndex = relatedUnits.findIndex((x) => x.name == this.item.unit.name);
        const biggerUnit = relatedUnits[currentUnitIndex - 1];

        if (this.item.quantity % nearestPower10 > 0)
            this.item.quantity = Math.ceil(this.item.quantity / nearestPower10) * nearestPower10;
        else if (biggerUnit) this.item.quantity += nearestPower10;
        else this.item.quantity++;

        if (biggerUnit && this.item.quantity >= biggerUnit.multiplier) {
            const biggerMultiplikator = biggerUnit.multiplier / this.item.unit.multiplier;
            this.item.quantity /= biggerMultiplikator;
            this.item.unit = biggerUnit;
        }
        this.requestFullUpdate();

        await waitForSeconds(iteration < 10 ? 0.5 : iteration < 20 ? 0.3 : 0.15, signal);
        await this.incrementAmount(signal, iteration + 1);
    }

    async decrementAmount(signal: AbortSignal, iteration = 1) {
        const nearestPower10 = Math.max(Math.pow(10, Math.floor(Math.log10(this.item.quantity / 3))), 1);
        const relatedUnits = MeasurementUnits.filter((x) => x.measurement == this.item.unit.measurement).orderBy(
            (x) => x.multiplier
        );
        const currentUnitIndex = relatedUnits.findIndex((x) => x.name == this.item.unit.name);
        const smallerUnit = relatedUnits[currentUnitIndex - 1];

        if (!smallerUnit && this.item.quantity <= 1) return;

        if (smallerUnit && this.item.quantity <= 1) {
            const smallerMultiplikator = smallerUnit.multiplier / this.item.unit.multiplier;
            this.item.quantity /= smallerMultiplikator;
            this.item.unit = smallerUnit;
            await this.decrementAmount(signal, iteration);
        }

        if (this.item.quantity % nearestPower10 > 0)
            this.item.quantity = Math.floor(this.item.quantity / nearestPower10) * nearestPower10;
        else this.item.quantity -= nearestPower10;

        this.requestFullUpdate();

        await waitForSeconds(iteration < 10 ? 0.5 : iteration < 20 ? 0.3 : 0.15, signal);
        await this.decrementAmount(signal, iteration + 1);
    }

    cancelEdit() {
        this.editAmount = false;
        this.dispatchEvent(new CustomEvent('refresh', { bubbles: true, composed: true }));
    }
}

import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { DialogBase } from '../../dialogs/dialog-base/dialog-base';
import { union } from '../../services/extensions/array.extensions';
import { getAllElementsRecurse } from '../../services/extensions/document.extensions';
import { renderOrderedListStyles } from './ordered-list.css';
import { renderOrderedList } from './ordered-list.html';

@customElement('ordered-list')
export class OrderedList extends LitElementBase {
    static override get styles() {
        return renderOrderedListStyles();
    }

    static get properties() {
        return {
            items: { type: Array, reflect: true },
            propertyName: { type: String, reflect: true },
        };
    }

    /**
     * @param {Event} eventTarget
     */
    static getRowToDropOn(eventTarget) {
        // @ts-ignore
        var targetElement = eventTarget.originalTarget;
        if (targetElement.draggable) return targetElement;
        var children = getAllElementsRecurse(targetElement);
        return children.find((x) => x.draggable);
    }

    constructor() {
        super();

        /** @type {any[]} */ this.items = [];
        /** @type {string} */ this.propertyName = '';

        /** @type {number} */ this.lastIndex = 0;
        /** @type {number[]} */ this.selectedIndices = [];

        /** @type {HTMLElement} */ this.dragged;
        /** @type {HTMLElement} */ this.lastHovered;
    }

    override connectedCallback() {
        super.connectedCallback();
        this.tabIndex = 0;
        this.focus();

        this.addEventListener('keyup', (event) => {
            if (event.key != 'Escape') return;

            event.stopPropagation();
            this.lastHovered = null;
            this.dragged = null;
            this.requestFullUpdate();
        });

        this.addEventListener('keydown', async (event) => {
            if (event.ctrlKey && event.key == 'a') {
                this.selectedIndices = Array.from(this.getRangeBetween(0, this.items.length - 1));
                this.requestFullUpdate();
            } else if (event.key == 'Delete') {
                var accepted = await DialogBase.show('Entfernen', {
                    content: `Folgende Einträge werden entfernt: 
                
                    ${this.selectedIndices.map((id) => this.items[id][this.propertyName]).join('\r\n')}`,
                    acceptActionText: 'Ja',
                    declineActionText: 'Nein',
                });

                if (!accepted) return;

                this.items = this.items.filter((_, id) => !this.selectedIndices.includes(id));
                this.selectedIndices = [];
                this.lastIndex = 0;
                this.requestFullUpdate();
                this.dispatchEvent(new CustomEvent('items-changed', { detail: this.items }));
            }
        });

        this.addEventListener('drop', (event) => {
            event.preventDefault();
            if (!this.lastHovered || !this.dragged) return;
            event.stopPropagation();

            var currentIndex = Number.parseInt(this.dragged.getAttribute('index'));
            var targetIndex = Number.parseInt(this.lastHovered.getAttribute('index'));

            if (!this.selectedIndices || !this.selectedIndices.includes(Number.parseInt(this.dragged.getAttribute('index'))))
                this.selectedIndices = [currentIndex];

            var draggedItems = this.selectedIndices.sort().map((id) => this.items[id]);
            for (var id of this.selectedIndices) {
                this.items[id] = JSON.parse(JSON.stringify(this.items[id]));
                this.items[id]['__deprecated'] = true;
            }

            this.items.splice(targetIndex, 0, ...draggedItems);
            this.items = this.items.filter((x) => !x.__deprecated);

            this.lastHovered = null;
            this.dragged = null;
            this.requestUpdate('items');
            this.dispatchEvent(new CustomEvent('items-changed', { detail: this.items }));
        });
    }

    override render() {
        return renderOrderedList(this);
    }

    /**
     * @param {MouseEvent} event
     * @param {number} index
     */
    handleRowClick(event, index) {
        var newValues = [index];

        if (event.shiftKey) newValues = Array.from(this.getRangeBetween(this.lastIndex, index));
        else this.lastIndex = index;

        if (event.ctrlKey) this.selectedIndices = union(this.selectedIndices, newValues);
        else this.selectedIndices = newValues;

        this.requestFullUpdate();
    }

    /**
     * @param {number} a
     * @param {number} b
     */
    *getRangeBetween(a, b) {
        var add = 1;
        if (a > b) add = -1;
        for (var current = a; current != b; current += add) yield current;
        yield current;
    }

    /**
     * @param {DragEvent} event
     */
    handleDragLeave(event) {
        if (!this.dragged) return;
        event.stopPropagation();
    }
}

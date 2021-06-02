import { Mood } from '../../data/enumerations/mood.js';
import { LitElement } from '../../exports.js';
import { scrollIntoParentView } from '../../services/extensions/document.extensions.js';
import { renderScrollSelectStyles } from './scroll-select.css.js';
import { renderScrollSelect } from './scroll-select.html.js';

export class ScrollSelect extends LitElement {
    static get styles() {
        return renderScrollSelectStyles();
    }

    static get properties() {
        return {
            options: { type: Array, reflect: true },
            value: { type: String, reflect: true },
        };
    }

    /** @returns {HTMLElement} */
    get scrollContainer() {
        var container = this.shadowRoot.getElementById('scroll-items');
        return container;
    }

    get scrollChildren() {
        return [...this.shadowRoot.querySelectorAll('#scroll-items > *:not(.inner-space)')].map(/** @param {HTMLElement} x */ (x) => x);
    }

    get canScrollUp() {
        return this.currentItemIndex > 0;
    }

    get canScrollBottom() {
        return this.currentItemIndex < this.children.length - 1;
    }

    constructor() {
        super();
        /** @type {string[]} */ this.options = [];
        /** @type {Mood} */ this.value = '';
        /** @type {number} */ this.currentItemIndex = 0;
        /** @type {boolean} */ this.mouseDown = false;
        /** @type {number} */ this.mouseStartY = 0;

        document.addEventListener('pointermove', (e) => this.onPointerMove(e));
        document.addEventListener('pointerup', () => this.onPointerUp());
    }

    /**
     * @param {Map<any, any>} _changedProperties
     */
    updated(_changedProperties) {
        super.updated(_changedProperties);
        if (!_changedProperties.has('value') || !this.value) return;

        this.currentItemIndex = this.options.findIndex((x) => x == this.value);
        scrollIntoParentView(this.scrollChildren[this.currentItemIndex], this.scrollContainer);
    }

    render() {
        return renderScrollSelect(this);
    }

    scrollToTop() {
        if (this.currentItemIndex <= 0) return;
        this.currentItemIndex--;
        this.notifyValueChanged();
    }

    scrollToBottom() {
        if (this.currentItemIndex >= this.scrollChildren.length - 1) return;
        this.currentItemIndex++;
        this.notifyValueChanged();
    }

    scrollToItem(value) {
        var index = this.options.findIndex((x) => x == value);
        this.currentItemIndex = index;
        this.notifyValueChanged();
    }

    /**
     * @param {PointerEvent} e
     */
    startDragScrolling(e) {
        this.mouseDown = true;
        this.mouseStartY = e.offsetY;
        this.requestUpdate(undefined);
    }

    /**
     * @param {PointerEvent} e
     */
    onPointerMove(e) {
        if (!this.mouseDown) return;
        var deltaY = e.movementY;
        var scrollContainer = this.scrollContainer;
        scrollContainer.scrollTop -= deltaY / 2;
        if (scrollContainer.scrollTop > scrollContainer.scrollHeight) scrollContainer.scrollTop = scrollContainer.scrollHeight;
        else if (scrollContainer.scrollTop < 0) scrollContainer.scrollTop = 0;
    }

    onPointerUp() {
        if (!this.mouseDown) return;
        this.mouseDown = false;

        var scrollContainer = this.scrollContainer;
        var currentScrollTop = scrollContainer.scrollTop + scrollContainer.offsetHeight / 2 - 20;
        var closestItem = { diff: Number.MAX_VALUE, index: 0 };
        this.scrollChildren.forEach((item, index) => {
            var diff = Math.abs(currentScrollTop - item.offsetTop);
            if (diff < closestItem.diff) closestItem = { diff: diff, index: index };
        });

        this.currentItemIndex = closestItem.index;
        this.notifyValueChanged();
    }

    notifyValueChanged() {
        scrollIntoParentView(this.scrollChildren[this.currentItemIndex], this.scrollContainer);
        this.dispatchEvent(new CustomEvent('valueChanged', { detail: { value: this.options[this.currentItemIndex] } }));
        this.requestUpdate(undefined);
    }
}

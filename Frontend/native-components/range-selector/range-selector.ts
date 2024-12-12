import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderRangeSelectorStyles } from './range-selector.css';
import { renderRangeSelector } from './range-selector.html';

@customElement('range-selector')
export class RangeSelector extends LitElementBase {
    static override get styles() {
        return renderRangeSelectorStyles();
    }

    get leftPercent() {
        if (!this.left) return 0;
        var left = this.left - this.min;
        var max = this.max - this.min;
        return (left / max) * 100;
    }

    get rightPercent() {
        if (!this.right) return 100;
        var right = this.right - this.min;
        var max = this.max - this.min;
        return (right / max) * 100;
    }

    static get properties() {
        return {
            min: { type: Number, reflect: true },
            max: { type: Number, reflect: true },
            left: { type: Number, reflect: true },
            right: { type: Number, reflect: true },

            draggingLeft: { type: Boolean, reflect: false, attribute: false },
            draggingRight: { type: Boolean, reflect: false, attribute: false },
        };
    }

    constructor() {
        super();

        /** @type {number} */ this.min;
        /** @type {number} */ this.max;
        /** @type {number} */ this.left;
        /** @type {number} */ this.right;

        /** @type {boolean} */ this.draggingLeft;
        /** @type {boolean} */ this.draggingRight;
    }

    override connectedCallback() {
        super.connectedCallback();

        window.addEventListener(
            'pointermove',
            (e: Event) => {
                if (this.draggingLeft) return this.changeLeftByMouse(e);
                if (this.draggingRight) return this.changeRightByMouse(e);
            },
            { signal: this.abortController.signal }
        );

        window.addEventListener(
            'pointerup',
            (e: Event) => {
                this.draggingLeft = false;
                this.draggingRight = false;
                this.dispatchEvent(new CustomEvent('range-changed', { detail: { left: this.left, right: this.right } }));
            },
            { signal: this.abortController.signal }
        );
    }

    override render() {
        this.left ??= this.min;
        this.right ??= this.max;
        return renderRangeSelector(this);
    }

    /**
     * @param {MouseEvent} event
     */
    changeLeftByMouse(event: MouseEvent) {
        var targetValue = this.getValueForMousePosition(event);
        if (targetValue < this.right) this.left = targetValue;
    }

    /**
     * @param {MouseEvent} event
     */
    changeRightByMouse(event: MouseEvent) {
        var targetValue = this.getValueForMousePosition(event);
        if (this.left < targetValue) this.right = targetValue;
    }

    /**
     * @param {MouseEvent} event
     */
    getValueForMousePosition(event: MouseEvent) {
        /** @type {HTMLElement} */ var target = this.shadowRoot!.querySelector('#container');
        var rect = target.getBoundingClientRect();
        var rangeAvailable = (this.max - this.min) / 100;
        var relativeLeft = event.screenX - rect.left;
        var leftPercent = (relativeLeft / rect.width) * 100;

        var targetValue = Math.round(this.min + rangeAvailable * leftPercent);
        if (leftPercent < 0) return this.min;
        else if (leftPercent > 100) return this.max;
        else return targetValue;
    }
}

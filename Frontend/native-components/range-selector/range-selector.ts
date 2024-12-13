import { customElement, property, state } from 'lit-element/decorators';
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

    @property({ type: Number }) min: number;
    @property({ type: Number }) max: number;
    @property({ type: Number }) left: number;
    @property({ type: Number }) right: number;

    @state() draggingLeft: boolean;
    @state() draggingRight: boolean;

    override connectedCallback() {
        super.connectedCallback();

        window.addEventListener(
            'pointermove',
            (e) => {
                if (this.draggingLeft) return this.changeLeftByMouse(e);
                if (this.draggingRight) return this.changeRightByMouse(e);
            },
            { signal: this.abortController.signal }
        );

        window.addEventListener(
            'pointerup',
            () => {
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
        return renderRangeSelector.call(this);
    }

    changeLeftByMouse(event: MouseEvent) {
        var targetValue = this.getValueForMousePosition(event);
        if (targetValue < this.right) this.left = targetValue;
    }

    changeRightByMouse(event: MouseEvent) {
        var targetValue = this.getValueForMousePosition(event);
        if (this.left < targetValue) this.right = targetValue;
    }

    getValueForMousePosition(event: MouseEvent) {
        var target = this.shadowRoot!.querySelector('#container') as HTMLElement;
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

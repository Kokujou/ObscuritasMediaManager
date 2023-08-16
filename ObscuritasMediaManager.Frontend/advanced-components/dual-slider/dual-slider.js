import { LitElementBase } from '../../data/lit-element-base.js';
import { renderDualSliderStyles } from './dual-slider.css.js';
import { renderDualSlider } from './dual-slider.html.js';

export class DualSlider extends LitElementBase {
    static get styles() {
        return renderDualSliderStyles();
    }

    static get properties() {
        return {
            steps: { type: Number, reflect: true },
        };
    }

    constructor() {
        super();
        /** @type {number} */ this.steps = 5;

        /** @type {number} */ this.leftValue = 0;
        /** @type {number} */ this.rightValue = 100;

        /** @type {HTMLElement} */ this.dragElement;

        this.addEventListener('resize', () => {
            this.requestUpdate(undefined);
        });

        document.addEventListener('pointermove', (e) => {
            if (!this.dragElement) return;

            var oldLeftValue = this.leftValue;
            var oldRightValue = this.rightValue;

            var left = this.getBoundingClientRect().x;
            var position = (e.x - left) / this.clientWidth;

            var closestPosition = this.getClosestPosition(position);
            if (this.dragElement.id == 'left-slider' && closestPosition < this.rightValue)
                this.leftValue = this.getClosestPosition(position);
            if (this.dragElement.id == 'right-slider' && closestPosition > this.leftValue)
                this.rightValue = this.getClosestPosition(position);

            if (oldLeftValue == this.leftValue && oldRightValue == this.rightValue) return;

            this.dispatchEvent(new CustomEvent('valueSpanChanged', { detail: { left: this.leftValue, right: this.rightValue } }));
            this.requestUpdate(undefined);
        });

        document.addEventListener('pointerup', () => (this.dragElement = undefined));
    }

    getClosestPosition(position) {
        var actualSteps = this.steps - 1;
        for (var step = 1.0; step <= actualSteps; step++) {
            var lastStepPosition = (1.0 / actualSteps) * (step - 1);
            var stepPosition = (1.0 / actualSteps) * step;

            if (position > stepPosition) continue;

            var lastDiff = position - lastStepPosition;
            var currentDiff = stepPosition - position;

            if (lastDiff < currentDiff) return lastStepPosition * 100;
            return stepPosition * 100;
        }
    }

    render() {
        return renderDualSlider(this);
    }

    /**
     * @param {HTMLElement} element
     */
    startDrag(element) {
        this.dragElement = element;
    }
}

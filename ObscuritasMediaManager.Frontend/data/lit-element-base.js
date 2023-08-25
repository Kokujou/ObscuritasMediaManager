import { LitElement } from '../exports.js';
import { Subscription } from './observable.js';

export class LitElementBase extends LitElement {
    constructor() {
        super();
        /** @type {Subscription[]} */ this.subscriptions = [];
        this.abortController = new AbortController();
        /** @type {Element[]} */ this.elementsWithTooltips = [];
    }

    updated(_changedProperties) {
        super.updated(_changedProperties);

        this.attachTooltips();
    }

    /**
     * @param {Event} event
     * @param {HTMLElement} [target]
     */
    redispatchEvent(event, target = null) {
        target ??= this;
        target.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }

    attachTooltips() {
        var elementsWithTooltips = this.shadowRoot.querySelectorAll('*[tooltip]');
        for (var element of elementsWithTooltips) {
            if (!this.elementsWithTooltips.includes(element)) this.attachTooltip(element);
        }
    }

    /**
     *
     * @param {Element} element
     */
    attachTooltip(element) {
        var tooltip = element.getAttribute('tooltip');
        var CustomTooltip = /** @type {typeof import('../native-components/custom-tooltip/custom-tooltip.js').CustomTooltip} */ (
            window.customElements.get('custom-tooltip')
        );
        element.addEventListener('pointerover', (e) => CustomTooltip.show(tooltip, e));
        this.elementsWithTooltips.push(element);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
    }
}

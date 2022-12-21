import { LitElement } from '../exports.js';
import { Subscription } from './observable.js';

export class LitElementBase extends LitElement {
    constructor() {
        super();
        /** @type {Subscription[]} */ this.subscriptions = [];
    }

    /**
     * @template T
     * @param {string} name
     * @param {T} [detail]
     */
    dispatchCustomEvent(name, detail) {
        super.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
        this.requestUpdate(undefined);
    }

    /**
     * @param {Event} event
     * @param {HTMLElement} [target]
     */
    redispatchEvent(event, target = null) {
        target ??= this;
        target.dispatchEvent(new Event(event.type, { bubbles: true, composed: true }));
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
    }
}

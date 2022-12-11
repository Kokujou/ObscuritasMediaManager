import { LitElement } from '../exports.js';
import { Subscription } from './observable.js';

export class LitElementBase extends LitElement {
    constructor() {
        super();
        /** @type {Subscription[]} */ this.subscriptions = [];
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.subscriptions.forEach((x) => x.unsubscribe());
        this.subscriptions = [];
    }
}

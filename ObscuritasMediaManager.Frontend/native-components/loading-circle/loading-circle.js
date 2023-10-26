import { LitElementBase } from '../../data/lit-element-base.js';
import { renderLoadingCircleStyles } from './loading-circle.css.js';
import { renderLoadingCircle } from './loading-circle.html.js';

export class LoadingCircle extends LitElementBase {
    static get styles() {
        return renderLoadingCircleStyles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        /** @type {string} */ this.someProperty;
    }

    render() {
        return renderLoadingCircle(this);
    }
}

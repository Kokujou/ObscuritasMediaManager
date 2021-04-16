import { LitElement } from '../../exports.js';
import { renderWebcomponentTemplateStyles } from './webcomponent-template.css.js';
import { renderWebcomponentTemplate } from './webcomponent-template.html.js';

export class WebcomponentTemplate extends LitElement {
    static get styles() {
        return renderWebcomponentTemplateStyles();
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
        return renderWebcomponentTemplate(this);
    }
}

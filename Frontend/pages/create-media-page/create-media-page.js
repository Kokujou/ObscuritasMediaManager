import { LitElementBase } from '../../data/lit-element-base.js';
import { renderCreateMediaPageStyles } from './create-media-page.css.js';
import { renderCreateMediaPage } from './create-media-page.html.js';

export class CreateMediaPage extends LitElementBase {
    static get isPage() {
        return true;
    }

    static get styles() {
        return renderCreateMediaPageStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
    }

    render() {
        return renderCreateMediaPage(this);
    }
}

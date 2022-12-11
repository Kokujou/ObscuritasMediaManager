import { LitElementBase } from '../../data/lit-element-base.js';
import { renderWelcomePageStyles } from './welcome-page.css.js';
import { renderWelcomePage } from './welcome-page.html.js';

export class WelcomePage extends LitElementBase {
    static get isPage() {
        return true;
    }
    static get styles() {
        return renderWelcomePageStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        document.title = 'Willkommen';
    }

    render() {
        return renderWelcomePage();
    }
}

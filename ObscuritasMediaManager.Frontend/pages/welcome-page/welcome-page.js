import { LitElement } from '../../exports.js';
import { renderWelcomePageStyles } from './welcome-page.css.js';
import { renderWelcomePage } from './welcome-page.html.js';

export class WelcomePage extends LitElement {
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

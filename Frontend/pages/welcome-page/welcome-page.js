import { LitElementBase } from '../../data/lit-element-base.js';
import { renderWelcomePageStyles } from './welcome-page.css.js';
import { renderWelcomePage } from './welcome-page.html.js';

export class WelcomePage extends LitElementBase {
    static isPage = true;
    static pageName = 'Willkommen';

    static get styles() {
        return renderWelcomePageStyles();
    }

    static get properties() {
        return {};
    }

    render() {
        return renderWelcomePage();
    }
}

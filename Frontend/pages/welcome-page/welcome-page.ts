import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { renderWelcomePageStyles } from './welcome-page.css';
import { renderWelcomePage } from './welcome-page.html';

@customElement('welcome-page')
export class WelcomePage extends LitElementBase {
    static isPage = true;
    static pageName = 'Willkommen';

    static override get styles() {
        return renderWelcomePageStyles();
    }

    static get properties() {
        return {};
    }

    override render() {
        return renderWelcomePage();
    }
}

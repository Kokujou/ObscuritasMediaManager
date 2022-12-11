import { LitElementBase } from '../../data/lit-element-base.js';
import { renderRecipesPageStyles } from './recipes-page.css.js';
import { renderRecipesPage } from './recipes-page.html.js';

export class RecipesPage extends LitElementBase {
    static get isPage() {
        return true;
    }

    static get styles() {
        return renderRecipesPageStyles();
    }

    static get properties() {
        return {
            someProperty: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        document.title = 'Rezepte';
    }

    render() {
        return renderRecipesPage(this);
    }
}

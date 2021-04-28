import { css, LitElement } from '../../exports.js';
import { renderAnimeGerSubTemplate } from './anime-ger-sub-page.html.js';

export class AnimeGerSubPage extends LitElement {
    static get styles() {
        return css``;
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        document.title = 'Anime (Ger Sub)';
    }

    render() {
        return renderAnimeGerSubTemplate(this);
    }
}

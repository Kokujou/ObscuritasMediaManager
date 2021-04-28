import { css, LitElement } from '../../exports.js';
import { renderAnimeGerDubTemplate } from './anime-ger-dub-page.html.js';

export class AnimeGerDubPage extends LitElement {
    static get styles() {
        return css``;
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        document.title = 'Anime (Ger Dub)';
    }

    render() {
        return renderAnimeGerDubTemplate(this);
    }
}

import { LitElementBase } from '../../data/lit-element-base.js';
import { css } from '../../exports.js';
import { renderAnimeGerDubTemplate } from './anime-ger-dub-page.html.js';

export class AnimeGerDubPage extends LitElementBase {
    static get isPage() {
        return true;
    }
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

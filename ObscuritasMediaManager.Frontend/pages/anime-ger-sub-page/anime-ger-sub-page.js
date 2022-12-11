import { LitElementBase } from '../../data/lit-element-base.js';
import { css } from '../../exports.js';
import { renderAnimeGerSubTemplate } from './anime-ger-sub-page.html.js';

export class AnimeGerSubPage extends LitElementBase {
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
        document.title = 'Anime (Ger Sub)';
    }

    render() {
        return renderAnimeGerSubTemplate(this);
    }
}

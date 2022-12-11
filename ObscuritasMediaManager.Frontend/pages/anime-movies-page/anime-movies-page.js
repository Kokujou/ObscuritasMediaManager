import { LitElementBase } from '../../data/lit-element-base.js';
import { css } from '../../exports.js';
import { renderAnimeMoviesPage } from './anime-movies-page.html.js';

export class AnimeMoviesPage extends LitElementBase {
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
        document.title = 'Anime Filme';
    }

    render() {
        return renderAnimeMoviesPage(this);
    }
}

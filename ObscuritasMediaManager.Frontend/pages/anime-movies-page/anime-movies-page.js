import { css, LitElement } from '../../exports.js';
import { renderAnimeMoviesPage } from './anime-movies-page.html.js';

export class AnimeMoviesPage extends LitElement {
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

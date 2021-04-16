import { MediaPage } from '../media-page/media-page.js';
import { renderAnimeGerSubTemplate } from './anime-ger-sub-page.html.js';

export class AnimeGerSubPage extends MediaPage {
    static get styles() {
        return super.styles;
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        document.title = 'Anime (Ger Sub)';
    }

    render() {
        var content = renderAnimeGerSubTemplate(this);
        return super.render(content);
    }
}

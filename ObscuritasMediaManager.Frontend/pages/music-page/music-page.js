import { LitElement } from '../../exports.js';
import { renderMusicPageStyles } from './music-page.css.js';
import { renderMusicPage } from './music-page.html.js';

export class MusicPage extends LitElement {
    static get styles() {
        return renderMusicPageStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        document.title = 'Musik';
        /** @type {string} */ this.someProperty;
    }

    render() {
        return renderMusicPage(this);
    }
}

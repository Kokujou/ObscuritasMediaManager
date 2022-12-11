import { LitElementBase } from '../../data/lit-element-base.js';
import { css } from '../../exports.js';
import { renderRealSeriesPage } from './real-movies-page.html.js';

export class RealMoviesPage extends LitElementBase {
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
        document.title = 'Realfilmserien';
    }

    render() {
        return renderRealSeriesPage(this);
    }
}

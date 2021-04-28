import { css, LitElement } from '../../exports.js';
import { renderRealSeriesPage } from './real-movies-page.html.js';

export class RealMoviesPage extends LitElement {
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

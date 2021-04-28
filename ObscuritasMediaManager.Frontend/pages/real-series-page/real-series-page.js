import { css, LitElement } from '../../exports.js';
import { renderRealSeriesPage } from './real-series-page.html.js';

export class RealSeriesPage extends LitElement {
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
        return renderRealSeriesPage(this);
    }
}

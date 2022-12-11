import { LitElementBase } from '../../data/lit-element-base.js';
import { css } from '../../exports.js';
import { renderRealSeriesPage } from './real-series-page.html.js';

export class RealSeriesPage extends LitElementBase {
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
        return renderRealSeriesPage(this);
    }
}

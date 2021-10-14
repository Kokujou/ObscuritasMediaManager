import { LitElement } from '../../exports.js';
import { renderWebcomponentTemplateStyles as renderPageLayoutStyles } from './page-layout.css.js';
import { renderPageLayout as renderPageLayout } from './page-layout.html.js';

export class PageLayout extends LitElement {
    static get styles() {
        return renderPageLayoutStyles();
    }

    static get properties() {
        return {};
    }

    static handleAuxClick(event, target) {
        event.preventDefault();
        window.open(`#${target}`, '_blank');
    }

    constructor() {
        super();
    }

    render() {
        return renderPageLayout();
    }
}

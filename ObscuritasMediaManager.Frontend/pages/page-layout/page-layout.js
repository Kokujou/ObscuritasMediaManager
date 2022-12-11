import { LitElementBase } from '../../data/lit-element-base.js';
import { session } from '../../data/session.js';
import { MediaService, MusicService } from '../../services/backend.services.js';
import { renderWebcomponentTemplateStyles as renderPageLayoutStyles } from './page-layout.css.js';
import { renderPageLayout } from './page-layout.html.js';

export class PageLayout extends LitElementBase {
    static get styles() {
        return renderPageLayoutStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();
        this.loadResources();
    }

    async loadResources() {
        this.initialized = false;

        try {
            session.mediaList.next(await MediaService.getAll());
        } catch (err) {
            console.error(err);
        }
        try {
            session.instruments.next(await MusicService.getInstruments());
        } catch (err) {
            console.error(err);
        }

        this.initialized = true;
        this.requestUpdate(undefined);
    }

    render() {
        return renderPageLayout();
    }
}

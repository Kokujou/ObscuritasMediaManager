import { MediaModel } from '../../data/media.model.js';
import { LitElement } from '../../exports.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
import { MediaService } from '../../services/media.service.js';
import { renderMediaDetailPageStyles } from './media-detail-page.css.js';
import { renderMediaDetailPage } from './media-detail-page.html.js';

export class MediaDetailPage extends LitElement {
    static get styles() {
        return renderMediaDetailPageStyles();
    }

    static get properties() {
        return {};
    }

    constructor() {
        super();

        this.media = new MediaModel();
    }

    connectedCallback() {
        super.connectedCallback();

        this.getMediaFromRoute();
    }

    async getMediaFromRoute() {
        this.media = await MediaService.getMedia(getQueryValue('name'), getQueryValue('type'));

        this.requestUpdate(undefined);
        document.title = this.media.name;
    }

    render() {
        if (!this.media) return;

        return renderMediaDetailPage(this);
    }
}

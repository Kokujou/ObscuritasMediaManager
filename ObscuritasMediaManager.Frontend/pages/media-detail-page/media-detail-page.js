import { MediaModel } from '../../data/media.model.js';
import { StreamingEntryModel } from '../../data/streaming-entry.model.js';
import { LitElement } from '../../exports.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
import { MediaService } from '../../services/media.service.js';
import { StreamingService } from '../../services/streaming.service.js';
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
        /** @type {StreamingEntryModel[]} */ this.streamingEntries = [];
    }

    connectedCallback() {
        super.connectedCallback();

        this.getMediaFromRoute();
    }

    async getMediaFromRoute() {
        var name = getQueryValue('name');
        var type = getQueryValue('type');
        this.media = await MediaService.getMedia(name, type);
        this.streamingEntries = await StreamingService.getStreamingEntries(name, type);
        console.log(this.streamingEntries);

        this.requestUpdate(undefined);
        document.title = this.media.name;
    }

    render() {
        if (!this.media) return;

        return renderMediaDetailPage(this);
    }
}

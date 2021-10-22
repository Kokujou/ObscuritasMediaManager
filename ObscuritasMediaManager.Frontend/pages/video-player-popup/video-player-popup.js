import { LitElement } from '../../exports.js';
import { StreamingEntryModel } from '../../obscuritas-media-manager-backend-client.js';
import { StreamingService } from '../../services/backend.services.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
import { renderVideoPlayerStyles } from './video-player-popup.css.js';
import { renderVideoPlayer } from './video-player-popup.html.js';

export class VideoPlayerPopup extends LitElement {
    static get styles() {
        return renderVideoPlayerStyles();
    }

    static get properties() {
        return {
            src: { type: String, reflect: false },
        };
    }

    constructor() {
        super();
        this.loadEntry();
        this.src = '';
    }

    async loadEntry() {
        var guid = getQueryValue('guid');
        var season = getQueryValue('season');
        var episode = Number.parseInt(getQueryValue('episode'));

        var entry = await StreamingService.getStream(guid, season, episode);
        this.src = `/ObscuritasMediaManager/api/file/video?videoPath=${entry.src}`;
    }

    render() {
        return renderVideoPlayer(this);
    }

    /**
     * @param {StreamingEntryModel} entry
     */
    static popup(entry) {
        window.open(
            `/?guid=${entry.id}&season=${entry.season}&episode=${entry.episode}#video`,
            '_blank',
            'location=yes,height=480,width=720,menubar=yes,toolbar=yes,status=yes'
        );
    }
}

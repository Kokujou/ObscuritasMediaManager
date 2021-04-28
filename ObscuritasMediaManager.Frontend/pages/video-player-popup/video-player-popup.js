import { StreamingEntryModel } from '../../data/streaming-entry.model.js';
import { LitElement } from '../../exports.js';
import { getQueryValue } from '../../services/extensions/url.extension.js';
import { StreamingService } from '../../services/streaming.service.js';
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
        var name = getQueryValue('name');
        var type = getQueryValue('type');
        var season = getQueryValue('season');
        var episode = getQueryValue('episode');

        var entry = await StreamingService.getStreamingEntry(name, type, season, episode);
        this.src = `https://localhost/ObscuritasMediaManager/api/file?filePath=${entry.src}`;
    }

    render() {
        return renderVideoPlayer(this);
    }

    /**
     * @param {StreamingEntryModel} entry
     */
    static popup(entry) {
        console.log(`https://localhost/?name=${entry.name}&type=${entry.type}&season=${entry.season}&episode=${entry.episode}#video`);
        window.open(
            `https://localhost/?name=${entry.name}&type=${entry.type}&season=${entry.season}&episode=${entry.episode}#video`,
            '_blank',
            'location=yes,height=480,width=720,menubar=yes,toolbar=yes,status=yes'
        );
    }
}

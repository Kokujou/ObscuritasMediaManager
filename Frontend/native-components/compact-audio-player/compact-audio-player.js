import { LitElementBase } from '../../data/lit-element-base.js';
import { AudioService } from '../../services/audio-service.js';
import { MessageSnackbar } from '../message-snackbar/message-snackbar.js';
import { renderCompactAudioPlayerStyles } from './compact-audio-player.css.js';
import { renderCompactAudioPlayer } from './compact-audio-player.html.js';

export class CompactAudioPlayer extends LitElementBase {
    static get styles() {
        return renderCompactAudioPlayerStyles();
    }

    static get properties() {
        return {
            path: { type: String, reflect: false },
        };
    }

    get currentTrackPosition() {
        if (AudioService.currentTrackPath == this.path) return AudioService.trackPosition.current();
        return 0;
    }
    get currentTrackDuration() {
        if (AudioService.currentTrackPath == this.path) return AudioService.duration ?? 0;
        return 0;
    }

    constructor() {
        super();

        /** @type {string} */ this.path = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.subscriptions.push(
            AudioService.changed.subscribe((x) => this.requestFullUpdate()),
            AudioService.trackPosition.subscribe((x) => this.requestFullUpdate())
        );
    }

    render() {
        return renderCompactAudioPlayer(this);
    }

    changeTrackPosition(value) {
        if (AudioService.duration == Infinity || AudioService.currentTrackPath != this.path) return;
        AudioService.changePosition(Number.parseInt(value));
    }

    async toggleCurrentTrack() {
        if (AudioService.currentTrackPath != this.path) await AudioService.changeTrack(this.path);
        try {
            if (AudioService.paused) await AudioService.play();
            else await AudioService.pause();
        } catch (ex) {
            console.error(ex);
            MessageSnackbar.popup('An error occurred while toggling the current track.', 'error');
        }

        this.requestFullUpdate();
    }

    /**
     * @param { number} newVolume
     */
    async changeVolume(newVolume) {
        await AudioService.changeVolume(newVolume / 100);
        localStorage.setItem('volume', newVolume.toString());
        await this.requestFullUpdate();
    }

    async disconnectedCallback() {
        await super.disconnectedCallback();
        await AudioService.reset();
    }
}

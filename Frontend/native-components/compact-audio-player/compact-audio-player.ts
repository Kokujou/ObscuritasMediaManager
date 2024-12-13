import { customElement, property } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { AudioService } from '../../services/audio-service';
import { MessageSnackbar } from '../message-snackbar/message-snackbar';
import { renderCompactAudioPlayerStyles } from './compact-audio-player.css';
import { renderCompactAudioPlayer } from './compact-audio-player.html';

@customElement('compact-audio-player')
export class CompactAudioPlayer extends LitElementBase {
    static override get styles() {
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

    @property() path = '';

    override connectedCallback() {
        super.connectedCallback();
        this.subscriptions.push(
            AudioService.changed.subscribe((x) => this.requestFullUpdate()),
            AudioService.trackPosition.subscribe((x) => this.requestFullUpdate())
        );
    }

    override render() {
        return renderCompactAudioPlayer.call(this);
    }

    changeTrackPosition(value: string) {
        if (AudioService.duration == Infinity || AudioService.currentTrackPath != this.path) return;
        AudioService.changePosition(Number.parseInt(value));
    }

    async toggleCurrentTrack() {
        try {
            if (AudioService.paused) await AudioService.play(this.path);
            else await AudioService.pause();
        } catch (ex) {
            console.error(ex);
            MessageSnackbar.popup('An error occurred while toggling the current track.', 'error');
        }

        this.requestFullUpdate();
    }

    async changeVolume(newVolume: number) {
        await AudioService.changeVolume(newVolume / 100);
        localStorage.setItem('volume', newVolume.toString());
        await this.requestFullUpdate();
    }

    override async disconnectedCallback() {
        await super.disconnectedCallback();
        await AudioService.reset();
    }
}

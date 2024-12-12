import { customElement } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { MusicModel } from '../../obscuritas-media-manager-backend-client';
import { PageRouting } from '../../pages/page-routing/page-routing';
import { AudioService } from '../../services/audio-service';
import { waitForSeconds } from '../../services/extensions/animation.extension';
import { renderPlayMusicDialogStyles } from './play-music-dialog.css';
import { renderPlayMusicDialog } from './play-music-dialog.html';

@customElement('play-music-dialog')
export class PlayMusicDialog extends LitElementBase {
    /** @type {PlayMusicDialog} */ static instance;
    static FadeDuration = 0.5;

    static override get styles() {
        return renderPlayMusicDialogStyles();
    }

    /**
     * @returns { PlayMusicDialog }
     * @param { MusicModel } track
     * @param {number} initialVolume
     * @param {number} startPosition
     */
    static show(track, initialVolume, startPosition) {
        if (
            AudioService.paused ||
            AudioService.trackPosition.current() <= 0 ||
            location.hash == '#music' ||
            location.hash == '#music-playlist' ||
            !track?.path
        )
            return;

        if (this.instance) {
            this.instance.reinitialize(track, initialVolume, startPosition);
            return;
        }

        var dialog = new PlayMusicDialog();
        PageRouting.container.append(dialog);
        dialog.reinitialize(track, initialVolume, startPosition);
        this.instance = dialog;

        return dialog;
    }

    /**
     * @param { MusicModel } track
     * @param {number} initialVolume
     * @param {number} startPosition
     */
    async reinitialize(track, initialVolume, startPosition) {
        await AudioService.changeTrack(track?.path);
        await AudioService.changeVolume(initialVolume);
        await AudioService.changePosition(startPosition);
        await AudioService.play(track?.path);
        this.currentTrack = track;
        await this.requestFullUpdate();

        this.subscriptions.push(AudioService.trackPosition.subscribe(() => this.requestFullUpdate()));
    }

    override render() {
        return renderPlayMusicDialog(this);
    }

    async toggle() {
        if (AudioService.paused) await AudioService.play(this.currentTrack.path);
        else await AudioService.pause();
    }

    changeTrackPosition(value) {
        if (AudioService.duration == Infinity) return;
        AudioService.trackPosition = value;
        this.requestFullUpdate();
    }

    async close() {
        this.setAttribute('closing', '');
        await this.requestFullUpdate();
        await waitForSeconds(PlayMusicDialog.FadeDuration);
        this.remove();
    }

    async disoverride connectedCallback() {
        await super.disconnectedCallback();
        PlayMusicDialog.instance = null;
        await AudioService.reset();
    }
}

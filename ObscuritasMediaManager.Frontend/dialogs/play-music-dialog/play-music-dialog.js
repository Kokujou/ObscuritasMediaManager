import { LitElementBase } from '../../data/lit-element-base.js';
import { MusicModel } from '../../obscuritas-media-manager-backend-client.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
import { AudioService } from '../../services/audio-service.js';
import { waitForSeconds } from '../../services/extensions/animation.extension.js';
import { renderPlayMusicDialogStyles } from './play-music-dialog.css.js';
import { renderPlayMusicDialog } from './play-music-dialog.html.js';

export class PlayMusicDialog extends LitElementBase {
    /** @type {PlayMusicDialog} */ static instance;
    static FadeDuration = 0.5;

    static get styles() {
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
        await AudioService.changeTrack(track);
        await AudioService.changeVolume(initialVolume);
        await AudioService.changePosition(startPosition);
        await AudioService.play();
        this.currentTrack = track;
        await this.requestFullUpdate();

        this.subscriptions.push(AudioService.trackPosition.subscribe(() => this.requestFullUpdate()));
    }

    render() {
        return renderPlayMusicDialog(this);
    }

    async toggle() {
        if (AudioService.paused) await AudioService.play();
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

    async disconnectedCallback() {
        await super.disconnectedCallback();
        PlayMusicDialog.instance = null;
        await AudioService.reset();
    }
}

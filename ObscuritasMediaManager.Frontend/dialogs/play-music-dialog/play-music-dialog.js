import { LitElementBase } from '../../data/lit-element-base.js';
import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { Session } from '../../data/session.js';
import { PageRouting } from '../../pages/page-routing/page-routing.js';
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
     * @param { ExtendedMusicModel } track
     * @param {number} initialVolume
     * @param {number} startPosition
     */
    static show(track, initialVolume, startPosition) {
        if (!track?.path) return;

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
     * @param { ExtendedMusicModel } track
     * @param {number} initialVolume
     * @param {number} startPosition
     */
    async reinitialize(track, initialVolume, startPosition) {
        Session.Audio.changeTrack(track);
        Session.Audio.volume = initialVolume;
        this.currentTrack = track;
        await this.requestFullUpdate();

        Session.Audio.play();
        Session.Audio.currentTime = startPosition;

        Session.Audio.addEventListener('timeupdate', () => this.requestFullUpdate(), { signal: this.abortController.signal });
        Session.Audio.addEventListener('loadedmetadata', () => this.requestFullUpdate(), { signal: this.abortController.signal });
    }

    render() {
        return renderPlayMusicDialog(this);
    }

    toggle() {
        if (Session.Audio.paused) Session.Audio.play();
        else Session.Audio.pause();
    }

    changeTrackPosition(value) {
        if (Session.Audio.duration == Infinity) return;
        Session.Audio.currentTime = value;
        this.requestFullUpdate();
    }

    async close() {
        this.setAttribute('closing', '');
        await this.requestFullUpdate();
        await waitForSeconds(PlayMusicDialog.FadeDuration);
        this.remove();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        PlayMusicDialog.instance = null;
        Session.Audio.reset();
    }
}

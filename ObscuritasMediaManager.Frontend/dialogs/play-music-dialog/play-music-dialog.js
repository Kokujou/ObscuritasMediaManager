import { LitElementBase } from '../../data/lit-element-base.js';
import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { FallbackAudio } from '../../native-components/fallback-audio/fallback-audio.js';
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

    static get properties() {
        return {
            someProperty: { type: String, reflect: false },
        };
    }

    get currentTrackUrl() {
        return `/ObscuritasMediaManager/api/file/audio?audioPath=${encodeURIComponent(this.currentTrack?.path)}`;
    }

    /** @type {HTMLAudioElement} */
    get audio() {
        return this.fallbackElement?.audioElement ?? document.createElement('audio');
    }

    constructor() {
        super();
        /** @type {number} */ this.currentVolume = 0;
        /** @type {ExtendedMusicModel} */ this.currentTrack = new ExtendedMusicModel();
        /** @type {FallbackAudio} */ this.fallbackElement;
        this.findAudioElement();
    }

    static stop() {
        if (!this.instance) return;
        /** @type {FallbackAudio} */ var fallbackElement = this.instance.shadowRoot.querySelector('fallback-audio');
        var audio = fallbackElement.audioElement;
        if (!audio) return;
        audio.pause();
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
        this.currentVolume = initialVolume;
        this.currentTrack = track;
        await this.requestUpdate(undefined);

        this.audio.play();
        this.audio.currentTime = startPosition;
    }

    render() {
        return renderPlayMusicDialog(this);
    }

    toggle() {
        if (this.audio.paused) this.audio.play();
        else this.audio.pause();
    }

    async findAudioElement() {
        do {
            await Promise.resolve();
            /** @type {FallbackAudio} */ var fallbackElement = this.shadowRoot.querySelector('fallback-audio');
        } while (!fallbackElement);

        this.fallbackElement = fallbackElement;
        this.requestUpdate(undefined);
    }

    changeTrackPosition(value) {
        if (this.audio.duration == Infinity) return;
        this.audio.currentTime = value;
        this.requestUpdate(undefined);
    }

    async close() {
        this.setAttribute('closing', '');
        await this.requestUpdate(undefined);
        await waitForSeconds(PlayMusicDialog.FadeDuration);
        this.remove();
    }

    disconnectedCallback() {
        PlayMusicDialog.instance = null;
    }
}

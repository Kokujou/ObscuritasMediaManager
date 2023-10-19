import { LitElementBase } from '../../data/lit-element-base.js';
import { AudioService } from '../../services/audio-service.js';
import { waitForSeconds } from '../../services/extensions/animation.extension.js';
import { renderAudioSubtitleDialogStyles } from './lyrics-dialog.css.js';
import { renderAudioSubtitleDialog } from './lyrics-dialog.html.js';

export class LyricsDialog extends LitElementBase {
    static get styles() {
        return renderAudioSubtitleDialogStyles();
    }

    static get properties() {
        return {
            scrollingPaused: { type: Boolean, reflect: true },
        };
    }

    /**
     *
     * @param {string} title
     * @param {string} lyrics
     * @param {boolean} canAccept
     * @returns
     */
    static async startShowing(title, lyrics, audio, canAccept) {
        var dialog = new LyricsDialog();
        dialog.lyrics = lyrics;
        dialog.title = title;
        dialog.canSave = canAccept;
        dialog.scrollingPaused = true;

        document.body.appendChild(dialog);
        await dialog.requestFullUpdate();
        /** @type {HTMLElement} */ var scrollContainer = dialog.shadowRoot.querySelector('#lyrics-content-wrapper-2');

        scrollContainer.style.animationDuration = audio.duration + 's';
        audio.onpause = () => dialog.requestFullUpdate();
        audio.onplay = () => dialog.requestFullUpdate();

        return dialog;
    }

    get lyricsLines() {
        return this.lyrics.split('\n');
    }

    constructor() {
        super();

        /** @type {string} */ this.lyrics;
        /** @type {boolean} */ this.canSave = false;
        /** @type {boolean} */ this.canNext = true;
        /** @type {boolean} */ this.scrollingPaused = false;
        /** @type {number} */ this.extendedScrollY = 0;
        /** @type {NodeJS.Timer} */ this.scrollInterval;

        this.onclick = () => this.fadeAndRemove();

        window.addEventListener(
            'keyup',
            (e) => {
                if (e.key == 'Escape') this.fadeAndRemove();
            },
            { signal: this.abortController.signal }
        );

        window.addEventListener('pointerup', () => clearInterval(this.scrollInterval), { signal: this.abortController.signal });
    }

    render() {
        return renderAudioSubtitleDialog(this);
    }

    async fadeAndRemove() {
        this.setAttribute('removed', '');
        await waitForSeconds(0.5);
        this.remove();
    }

    async togglePlay() {
        this.scrollingPaused = !this.scrollingPaused;

        if (this.scrollingPaused) await AudioService.pause();
        else await AudioService.play();

        await this.requestFullUpdate();
    }

    notifyPlaylistSaved() {
        this.dispatchEvent(new CustomEvent('playlist-saved'));
    }

    requestNewLyrics() {
        this.dispatchEvent(new CustomEvent('request-new-lyrics'));
        this.canSave = true;
        this.requestFullUpdate();
    }

    /**
     * @param {"up" | "down"} direction
     */
    startScrolling(direction) {
        /** @type {HTMLElement} */ var scrollContainer = this.shadowRoot.querySelector('#lyrics-content-wrapper-2');
        if (!scrollContainer) return;

        this.scrollInterval = setInterval(() => {
            if (direction == 'up') this.extendedScrollY += 1;
            if (direction == 'down') this.extendedScrollY -= 1;

            scrollContainer.style.translate = `0 ${this.extendedScrollY}px`;
        }, 1);
    }

    updateLyrics(newTitle, newLyrics) {
        this.lyrics = newLyrics;
        this.title = newTitle;
        /** @type {HTMLElement} */ var scrollContainer = this.shadowRoot.querySelector('#lyrics-content-wrapper-2');
        scrollContainer.getAnimations()[0].currentTime = 0;

        this.requestFullUpdate();
    }
}

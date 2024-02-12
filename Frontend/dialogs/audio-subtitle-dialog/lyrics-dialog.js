import { LitElementBase } from '../../data/lit-element-base.js';
import { Session } from '../../data/session.js';
import { MusicModel } from '../../obscuritas-media-manager-backend-client.js';
import { AudioService } from '../../services/audio-service.js';
import { MusicService } from '../../services/backend.services.js';
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
     * @param {MusicModel} track
     * @returns
     */
    static async startShowing(track) {
        var dialog = new LyricsDialog();

        if (track.lyrics?.length > 0) {
            dialog.title = track.displayName;
            dialog.lyrics = track.lyrics;
            dialog.lyricsOffset = -1;
        } else {
            var lyrics = await MusicService.getLyrics(track.hash);
            dialog.lyrics = lyrics.text;
            dialog.title = lyrics.title;
            dialog.lyricsOffset = 0;
        }
        dialog.track = track;
        dialog.scrollingPaused = AudioService.paused;
        dialog.extendedScrollY = 0;

        document.body.appendChild(dialog);
        await dialog.requestFullUpdate();
        /** @type {HTMLElement} */ var scrollContainer = dialog.shadowRoot.querySelector('#lyrics-content-wrapper-2');

        scrollContainer.style.translate = '0 0';
        scrollContainer.style.animationDuration = (AudioService.duration ?? 30) + 'ms';

        AudioService.changed.subscribe(() => {
            scrollContainer.style.animationDuration = (AudioService.duration ?? 30) + 'ms';
            console.log(AudioService.duration, scrollContainer);
            dialog.requestFullUpdate();
        });

        return dialog;
    }

    get lyricsLines() {
        return this.lyrics.split('\n');
    }

    constructor() {
        super();

        /** @type {string} */ this.lyrics;
        /** @type {boolean} */ this.canNext = true;
        /** @type {boolean} */ this.scrollingPaused = false;
        /** @type {number} */ this.lyricsOffset = -1;
        /** @type {number} */ this.extendedScrollY = 0;
        /** @type {NodeJS.Timer} */ this.scrollInterval;
        /** @type {MusicModel} */ this.track = new MusicModel();

        this.onclick = () => this.fadeAndRemove();

        window.addEventListener(
            'keyup',
            (e) => {
                if (e.key == 'Escape') this.fadeAndRemove();
            },
            { signal: this.abortController.signal }
        );

        window.addEventListener('pointerup', () => {
            clearInterval(this.scrollInterval), { signal: this.abortController.signal };
        });

        Session.currentPage.subscribe((x) => this.fadeAndRemove());
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

    notifyLyricsSaved() {
        this.dispatchEvent(new CustomEvent('lyrics-saved'));
        this.lyricsOffset = -1;
    }

    async requestNewLyrics() {
        try {
            this.lyricsOffset++;
            var newLyrics = await MusicService.getLyrics(this.track.hash, this.lyricsOffset);
            this.updateLyrics(newLyrics.title, newLyrics.text);
        } catch {
            this.canNext = false;
            await this.requestFullUpdate();
        }
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

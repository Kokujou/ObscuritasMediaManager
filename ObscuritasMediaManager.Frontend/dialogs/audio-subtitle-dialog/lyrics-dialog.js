import { LitElementBase } from '../../data/lit-element-base.js';
import { waitForSeconds } from '../../services/extensions/animation.extension.js';
import { renderAudioSubtitleDialogStyles } from './lyrics-dialog.css.js';
import { renderAudioSubtitleDialog } from './lyrics-dialog.html.js';

export class LyricsDialog extends LitElementBase {
    static get styles() {
        return renderAudioSubtitleDialogStyles();
    }

    static async show(lyrics, duration) {
        var dialog = new LyricsDialog();
        dialog.lyrics = lyrics;

        document.body.appendChild(dialog);
        await dialog.requestFullUpdate();
        /** @type {HTMLElement} */ var scrollContainer = dialog.shadowRoot.querySelector('#lyrics-content-wrapper-2');

        scrollContainer.style.animationDuration = duration + 's';
    }

    get lyricsLines() {
        return this.lyrics.split('\n');
    }

    constructor() {
        super();

        /** @type {string} */ this.lyrics;

        this.onclick = () => this.fadeAndRemove();

        window.addEventListener(
            'keyup',
            (e) => {
                if (e.key == 'Escape') this.fadeAndRemove();
            },
            { signal: this.abortController.signal }
        );
    }

    render() {
        return renderAudioSubtitleDialog(this);
    }

    async fadeAndRemove() {
        this.setAttribute('removed', '');
        await waitForSeconds(0.5);
        this.remove();
    }
}

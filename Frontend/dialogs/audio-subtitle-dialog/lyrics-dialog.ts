import { customElement, state } from 'lit-element/decorators';
import { LitElementBase } from '../../data/lit-element-base';
import { Session } from '../../data/session';
import { waitForSeconds } from '../../extensions/animation.extension';
import { MusicModel } from '../../obscuritas-media-manager-backend-client';
import { AudioService } from '../../services/audio-service';
import { MusicService } from '../../services/backend.services';
import { renderAudioSubtitleDialogStyles } from './lyrics-dialog.css';
import { renderAudioSubtitleDialog } from './lyrics-dialog.html';

@customElement('lyrics-dialog')
export class LyricsDialog extends LitElementBase {
    static override get styles() {
        return renderAudioSubtitleDialogStyles();
    }

    static async startShowing(track: MusicModel) {
        var dialog = new LyricsDialog();

        if (track.lyrics?.length && track.lyrics?.length > 0) {
            dialog.title = track.displayName;
            dialog.lyrics = track.lyrics;
            dialog.lyricsOffset = -1;
        } else {
            var lyrics = await MusicService.getLyrics(track.hash!);
            dialog.lyrics = lyrics.text;
            dialog.title = lyrics.title;
            dialog.lyricsOffset = 0;
        }
        dialog.track = track;
        dialog.scrollingPaused = AudioService.paused;
        dialog.extendedScrollY = 0;

        document.body.appendChild(dialog);
        await dialog.requestFullUpdate();
        var scrollContainer = dialog.shadowRoot!.querySelector<HTMLElement>('#lyrics-content-wrapper-2')!;

        scrollContainer.style.translate = '0 0';
        scrollContainer.style.animationDuration = (AudioService.duration ?? 30) + 'ms';

        AudioService.changed.subscribe(() => {
            scrollContainer.style.animationDuration = (AudioService.duration ?? 30) + 'ms';
            dialog.requestFullUpdate();
        });

        return dialog;
    }

    get lyricsLines() {
        return this.lyrics.split('\n');
    }

    @state() public declare lyrics: string;
    @state() protected declare canNext: boolean;
    @state() protected declare scrollingPaused: boolean;
    @state() protected declare lyricsOffset: number;
    @state() protected declare extendedScrollY: number;
    @state() protected declare scrollInterval: NodeJS.Timeout;
    @state() protected declare track: MusicModel;

    constructor() {
        super();
        this.canNext = true;
        this.track = new MusicModel();
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

    override render() {
        return renderAudioSubtitleDialog.call(this);
    }

    async fadeAndRemove() {
        this.setAttribute('removed', '');
        await waitForSeconds(0.5);
        this.remove();
    }

    async togglePlay() {
        this.scrollingPaused = !this.scrollingPaused;

        if (this.scrollingPaused) await AudioService.pause();
        else await AudioService.play(this.track.path);

        await this.requestFullUpdate();
    }

    notifyLyricsSaved() {
        this.dispatchEvent(new CustomEvent('lyrics-saved'));
        this.lyricsOffset = -1;
    }

    async requestNewLyrics() {
        try {
            this.lyricsOffset++;
            var newLyrics = await MusicService.getLyrics(this.track.hash!, this.lyricsOffset);
            this.updateLyrics(newLyrics.title, newLyrics.text);
        } catch {
            this.canNext = false;
            await this.requestFullUpdate();
        }
        this.requestFullUpdate();
    }

    startScrolling(direction: 'up' | 'down') {
        var scrollContainer = this.shadowRoot!.querySelector<HTMLElement>('#lyrics-content-wrapper-2')!;
        if (!scrollContainer) return;

        this.scrollInterval = setInterval(() => {
            if (direction == 'up') this.extendedScrollY += 1;
            if (direction == 'down') this.extendedScrollY -= 1;

            scrollContainer.style.translate = `0 ${this.extendedScrollY}px`;
        }, 1);
    }

    updateLyrics(newTitle: string, newLyrics: string) {
        this.lyrics = newLyrics;
        this.title = newTitle;
        var scrollContainer = this.shadowRoot!.querySelector('#lyrics-content-wrapper-2')!;
        scrollContainer.getAnimations()[0].currentTime = 0;

        this.requestFullUpdate();
    }
}

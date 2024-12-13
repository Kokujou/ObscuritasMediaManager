import { html } from 'lit-element';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { AudioService } from '../../services/audio-service';
import { LyricsDialog } from './lyrics-dialog';

export function renderAudioSubtitleDialog(this: LyricsDialog) {
    return html`
        <div id="lyrics-wrapper" @click="${(e: Event) => e.stopPropagation()}">
            <div id="lyrics-content-wrapper">
                <div id="lyrics-content-wrapper-2">
                    <h3>${this.title}</h3>
                    ${this.lyricsLines.map((x) => html`<div class="line">${x}</div>`)}
                </div>
            </div>
            <div id="audio-controls">
                <div
                    id="save-lyrics-button"
                    class="link"
                    @click="${() => this.notifyLyricsSaved()}"
                    ?disabled="${this.lyricsOffset < 0}"
                >
                    <div class="icon" icon="${Icons.SaveTick}"></div>
                    Lyrics Speichern
                </div>
                <div id="next-lyrics-button" class="link" @click="${() => this.requestNewLyrics()}" ?disabled="${!this.canNext}">
                    <div class="icon" icon="${Icons.Cross}"></div>
                    Neue Lyrics Laden
                </div>
                <div id="volume-input"></div>
            </div>
            <div id="scroll-controls">
                <div
                    id="scroll-up-button"
                    class="icon"
                    icon="${Icons.FastForward}"
                    @pointerdown="${(e: Event) => this.startScrolling('up')}"
                ></div>
                ${this.scrollingPaused || AudioService.paused
                    ? html`<div class="icon" icon="${Icons.Play}" @click="${this.togglePlay}"></div>`
                    : html` <div class="icon" icon="${Icons.Pause}" @click="${this.togglePlay}"></div>`}
                <div
                    class="icon"
                    id="scroll-down-button"
                    icon="${Icons.FastForward}"
                    @pointerdown="${(e: Event) => this.startScrolling('down')}"
                ></div>
            </div>
        </div>
    `;
}

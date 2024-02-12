import { html } from '../../exports.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { AudioService } from '../../services/audio-service.js';
import { LyricsDialog } from './lyrics-dialog.js';

/**
 * @param { LyricsDialog } dialog
 */
export function renderAudioSubtitleDialog(dialog) {
    return html`
        <div id="lyrics-wrapper" @click="${(e) => e.stopPropagation()}">
            <div id="lyrics-content-wrapper">
                <div id="lyrics-content-wrapper-2">
                    <h3>${dialog.title}</h3>
                    ${dialog.lyricsLines.map((x) => html`<div class="line">${x}</div>`)}
                </div>
            </div>
            <div id="audio-controls">
                <div
                    id="save-lyrics-button"
                    class="link"
                    @click="${() => dialog.notifyLyricsSaved()}"
                    ?disabled="${dialog.lyricsOffset < 0}"
                >
                    <div class="icon" icon="${Icons.SaveTick}"></div>
                    Lyrics Speichern
                </div>
                <div
                    id="next-lyrics-button"
                    class="link"
                    @click="${() => dialog.requestNewLyrics()}"
                    ?disabled="${!dialog.canNext}"
                >
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
                    @pointerdown="${(e) => dialog.startScrolling('up')}"
                ></div>
                ${dialog.scrollingPaused || AudioService.paused
                    ? html`<div class="icon" icon="${Icons.Play}" @click="${dialog.togglePlay}"></div>`
                    : html` <div class="icon" icon="${Icons.Pause}" @click="${dialog.togglePlay}"></div>`}
                <div
                    class="icon"
                    id="scroll-down-button"
                    icon="${Icons.FastForward}"
                    @pointerdown="${(e) => dialog.startScrolling('down')}"
                ></div>
            </div>
        </div>
    `;
}

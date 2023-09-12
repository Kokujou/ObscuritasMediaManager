import { html } from '../../exports.js';
import { IconRegistry } from '../../resources/inline-icons/icon-registry.js';
import { LyricsDialog } from './lyrics-dialog.js';

/**
 * @param { LyricsDialog } dialog
 */
export function renderAudioSubtitleDialog(dialog) {
    return html`
        <div id="lyrics-wrapper" @click="${(e) => e.stopPropagation()}">
            <div id="lyrics-content-wrapper">
                <div id="lyrics-content-wrapper-2">${dialog.lyricsLines.map((x) => html`<div class="line">${x}</div>`)}</div>
            </div>
            <div id="audio-controls">
                <div
                    id="save-lyrics-button"
                    class="link"
                    @click="${() => dialog.notifyPlaylistSaved()}"
                    ?disabled="${!dialog.canSave}"
                >
                    <div class="icon" icon="${IconRegistry.SaveTickIcon.name}"></div>
                    Lyrics Speichern
                </div>
                <div
                    id="next-lyrics-button"
                    class="link"
                    @click="${() => dialog.requestNewLyrics()}"
                    ?disabled="${!dialog.canNext}"
                >
                    <div class="icon" icon="${IconRegistry.CrossIcon.name}"></div>
                    Neue Lyrics Laden
                </div>
                <div id="volume-input"></div>
            </div>
            <div id="scroll-controls">
                <div
                    id="scroll-up-button"
                    class="icon"
                    icon="${IconRegistry.FastForwardIcon.name}"
                    @pointerdown="${(e) => dialog.startScrolling('up')}"
                ></div>
                ${dialog.scrollingPaused || dialog.audio.audioElement.paused
                    ? html`<div class="icon" icon="${IconRegistry.PlayIcon.name}" @click="${dialog.togglePlay}"></div>`
                    : html` <div class="icon" icon="${IconRegistry.PauseIcon.name}" @click="${dialog.togglePlay}"></div>`}
                <div
                    class="icon"
                    id="scroll-down-button"
                    icon="${IconRegistry.FastForwardIcon.name}"
                    @pointerdown="${(e) => dialog.startScrolling('down')}"
                ></div>
            </div>
        </div>
    `;
}

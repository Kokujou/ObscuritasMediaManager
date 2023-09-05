import { html } from '../../exports.js';
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
        </div>
    `;
}

import { html } from '../../exports.js';
import { FallbackAudio } from './fallback-audio.js';

/**
 * @param { FallbackAudio } audio
 */
export function renderFallbackAudio(audio) {
    return html`
        <audio
            controls
            preload="auto"
            .src="${audio.currentSrc}"
            .volume="${audio.volume}"
            @error="${() => audio.initiateFallback()}"
            @timeupdate="${(e) => audio.redispatchEvent(e)}"
            @ended="${(e) => audio.redispatchEvent(e)}"
            @loadedmetadata="${(e) => audio.redispatchEvent(e)}"
            style="display:none"
        ></audio>
    `;
}

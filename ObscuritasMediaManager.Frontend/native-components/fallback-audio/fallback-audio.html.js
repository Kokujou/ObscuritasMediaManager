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
            @timeupdate="${(e) => audio.dispatchEvent(new Event(e.type, { bubbles: true, composed: true }))}"
            @ended="${(e) => audio.dispatchEvent(new Event(e.type, { bubbles: true, composed: true }))}"
            @loadedmetadata="${(e) => audio.dispatchEvent(new Event(e.type, { bubbles: true, composed: true }))}"
            @message="${audio.overrideFetch}"
            style="display:none"
        ></audio>
    `;
}

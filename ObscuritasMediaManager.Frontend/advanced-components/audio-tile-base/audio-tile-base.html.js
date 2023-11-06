import { html } from '../../exports.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { AudioTileBase } from './audio-tile-base.js';

/**
 * @param { AudioTileBase } audioTile
 */
export function renderAudioTileBase(audioTile) {
    return html`
        <div
            id="audio-tile-container"
            @click="${(e) => {
                e.stopPropagation();
                e.preventDefault();
                audioTile.dispatchEvent(new CustomEvent('toggle', { composed: true, bubbles: true }));
            }}"
        >
            <div
                id="audio-image"
                icon="${audioTile.paused ? Icons.Play : Icons.Pause}"
                ?invisible="${!!audioTile.visualizationData}"
                @click="${(e) => audioTile.dispatchEvent(new CustomEvent('imageClicked', { composed: true, bubbles: true }))}"
            ></div>
            <canvas id="audio-visualization"></canvas>
            <div
                id="language-icon"
                language="${audioTile.track.language}"
                ?disabled="${audioTile.disabled}"
                @click="${(e) => audioTile.dispatchEvent(new CustomEvent('changeLanguage', { bubbles: true, composed: true }))}"
            ></div>
            <div
                ?disabled="${audioTile.disabled}"
                @click="${(e) => audioTile.dispatchEvent(new CustomEvent('nextParticipants', { bubbles: true, composed: true }))}"
                id="participant-count-button"
                class="inline-icon"
                participants="${audioTile.track.participants}"
            ></div>
            <svg
                id="instrumentation-button"
                class="inline-icon"
                viewBox="0 0 70 18"
                ?disabled="${audioTile.disabled}"
                @click="${(e) =>
                    audioTile.dispatchEvent(new CustomEvent('nextInstrumentation', { bubbles: true, composed: true }))}"
            >
                <text y="80%" text-anchor="start">${audioTile.track.instrumentation}</text>
            </svg>

            <div id="rating-container" ?disabled="${audioTile.disabled}">
                ${[1, 2, 3, 4, 5].map(
                    (rating) =>
                        html` <svg
                            viewBox="0 0 15 18"
                            class="star ${rating <= audioTile.track.rating ? 'selected' : ''} ${rating <= audioTile.hoveredRating
                                ? 'hovered'
                                : ''}"
                        >
                            <text
                                x="0"
                                y="15"
                                @pointerover="${() => (audioTile.hoveredRating = rating)}"
                                @pointerout="${() => (audioTile.hoveredRating = 0)}"
                                @click="${(e) =>
                                    audioTile.dispatchEvent(
                                        new CustomEvent('changeRating', { bubbles: true, composed: true, detail: rating })
                                    )}"
                            >
                                ★
                            </text>
                        </svg>`
                )}
            </div>

            <div
                id="instruments-container"
                ?disabled="${audioTile.disabled}"
                @click="${(e) =>
                    audioTile.dispatchEvent(new CustomEvent('changeInstruemnts', { bubbles: true, composed: true }))}"
            >
                ${audioTile.track.instrumentTypes?.length == 0 ? html`<a id="add-instruments-link">Add Instruments</a>` : ''}
                ${audioTile.track.instrumentTypes?.map(
                    (instrument) => html` <div class="instrument-icon inline-icon" instrument-type="${instrument}"></div> `
                )}
            </div>
        </div>
    `;
}

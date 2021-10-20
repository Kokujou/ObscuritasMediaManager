import { html } from '../../exports.js';
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
                audioTile.notifyEvent('toggle');
                return false;
            }}"
        >
            <div id="audio-image"></div>
            <div
                id="language-icon"
                class="inline-icon ${audioTile.track.language}"
                @click="${() => audioTile.notifyEvent('changeLanguage')}"
            ></div>
            <div
                id="nation-icon"
                class="inline-icon ${audioTile.track.nation}"
                @click="${() => audioTile.notifyEvent('changeNation')}"
            ></div>
            <div
                @click="${() => audioTile.notifyEvent('nextParticipants')}"
                id="participant-count-button"
                class="inline-icon ${audioTile.track.participants}"
            ></div>
            <svg
                id="instrumentation-button"
                class="inline-icon"
                viewBox="0 0 60 18"
                @click="${() => audioTile.notifyEvent('nextInstrumentation')}"
            >
                <text x="50%" y="80%" text-anchor="middle">${audioTile.track.instrumentation}</text>
            </svg>

            <div id="rating-container">
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
                                @click="${(e) => audioTile.notifyEvent('changeRating', { rating })}"
                            >
                                ★
                            </text>
                        </svg>`
                )}
            </div>

            <div id="instruments-container" @click="${() => audioTile.notifyEvent('changeInstruemnts')}">
                ${audioTile.track.instrumentTypes?.length == 0 ? html`<a id="add-instruments-link">Add Instruments</a>` : ''}
                ${audioTile.track.instrumentTypes.map(
                    (instrument) => html` <div class="instrument-icon inline-icon ${instrument}"></div> `
                )}
            </div>
        </div>
    `;
}

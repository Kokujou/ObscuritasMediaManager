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
            }}"
        >
            <div id="audio-image" @click="${(e) => audioTile.notifyEvent('imageClicked', e)}"></div>
            <div
                id="language-icon"
                language="${audioTile.track.language}"
                @click="${(e) => audioTile.notifyEvent('changeLanguage', e)}"
            ></div>
            <div
                id="nation-icon"
                nation="${audioTile.track.nation}"
                @click="${(e) => audioTile.notifyEvent('changeLanguage', e)}"
            ></div>
            <div
                @click="${(e) => audioTile.notifyEvent('nextParticipants', e)}"
                id="participant-count-button"
                class="inline-icon ${audioTile.track.participants}"
            ></div>
            <svg
                id="instrumentation-button"
                class="inline-icon"
                viewBox="0 0 60 18"
                @click="${(e) => audioTile.notifyEvent('nextInstrumentation', e)}"
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
                                @click="${(e) => audioTile.notifyEvent('changeRating', { rating }, e)}"
                            >
                                ★
                            </text>
                        </svg>`
                )}
            </div>

            <div id="instruments-container" @click="${(e) => audioTile.notifyEvent('changeInstruemnts', e)}">
                ${audioTile.track.instrumentTypes?.length == 0 ? html`<a id="add-instruments-link">Add Instruments</a>` : ''}
                ${audioTile.track.instrumentTypes.map(
                    (instrument) => html` <div class="instrument-icon inline-icon ${instrument}"></div> `
                )}
            </div>
        </div>
    `;
}

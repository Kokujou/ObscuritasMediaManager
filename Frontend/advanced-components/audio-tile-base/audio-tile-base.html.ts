import { html } from 'lit';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { AudioTileBase } from './audio-tile-base';

export function renderAudioTileBase(this: AudioTileBase) {
    return html`
        <div
            id="audio-tile-container"
            @click="${(e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('toggle', { composed: true, bubbles: true }));
            }}"
        >
            <div
                id="audio-image"
                icon="${this.paused ? Icons.Play : Icons.Pause}"
                ?invisible="${!!this.visualizationData?.current() && !this.paused}"
                @click="${() => this.dispatchEvent(new CustomEvent('imageClicked', { composed: true, bubbles: true }))}"
            ></div>
            <canvas id="audio-visualization" ?invisible="${!this.visualizationData?.current()}"></canvas>
            <div
                id="language-icon"
                language="${this.track.language}"
                ?disabled="${this.disabled}"
                @click="${() => this.dispatchEvent(new CustomEvent('changeLanguage', { bubbles: true, composed: true }))}"
            ></div>
            <div
                ?disabled="${this.disabled}"
                @click="${() => this.dispatchEvent(new CustomEvent('nextParticipants', { bubbles: true, composed: true }))}"
                id="participant-count-button"
                class="inline-icon"
                participants="${this.track.participants}"
            ></div>
            <svg
                id="instrumentation-button"
                class="inline-icon"
                viewBox="0 0 70 18"
                ?disabled="${this.disabled}"
                @click="${() => this.dispatchEvent(new CustomEvent('nextInstrumentation', { bubbles: true, composed: true }))}"
            >
                <text y="80%" text-anchor="start">${this.track.instrumentation}</text>
            </svg>

            <div id="rating-container" ?disabled="${this.disabled}">
                ${[1, 2, 3, 4, 5].map(
                    (rating) =>
                        html` <svg
                            viewBox="0 0 15 18"
                            class="star ${rating <= this.track.rating ? 'selected' : ''} ${rating <= this.hoveredRating
                                ? 'hovered'
                                : ''}"
                        >
                            <text
                                x="0"
                                y="15"
                                @pointerover="${() => (this.hoveredRating = rating)}"
                                @pointerout="${() => (this.hoveredRating = 0)}"
                                @click="${() =>
                                    this.dispatchEvent(
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
                ?disabled="${this.disabled}"
                @click="${() => this.dispatchEvent(new CustomEvent('changeInstruemnts', { bubbles: true, composed: true }))}"
            >
                ${this.track.instrumentTypes?.length == 0 ? html`<a id="add-instruments-link">Add Instruments</a>` : ''}
                ${this.track.instrumentTypes?.map(
                    (instrument) => html` <div class="instrument-icon inline-icon" instrument-type="${instrument}"></div> `
                )}
            </div>
        </div>
    `;
}

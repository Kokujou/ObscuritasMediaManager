import { html } from 'lit-element';
import { getMoodFontColor, MoodColors } from '../../../data/enumerations/mood';
import { Mood } from '../../../obscuritas-media-manager-backend-client';
import { AudioTile } from './audio-tile';

export function renderAudioTile(this: AudioTile) {
    return html` <style>
            :host {
                --primary-color: ${MoodColors[this.track.mood1]};
                --secondary-color: ${MoodColors[this.track.mood2 == Mood.Unset ? this.track.mood1 : this.track.mood2]};
                --font-color: ${getMoodFontColor(this.track.mood1)};
            }
        </style>
        <div id="tile-container">
            <audio-tile-base
                .track="${this.track}"
                ?paused="${this.paused}"
                @imageClicked="${() => this.notifyMusicToggled()}"
            ></audio-tile-base>
            <div id="tile-description">
                <div id="instrument-icons">${renderInstrumentIcons.call(this)}</div>
                <div id="audio-title">${this.track.displayName}</div>
                <div id="audio-genre-section">${renderGenreTags.call(this)}</div>
            </div>
        </div>`;
}

function renderGenreTags(this: AudioTile) {
    return this.track.genres.map((genre) => html` <tag-label .text="${genre}"></tag-label> `);
}

/**
 * @param {AudioTile} audioTile
 */
function renderInstrumentIcons(this: AudioTile) {
    var iconsToDisplay = this.track.instrumentTypes;
    return html`${iconsToDisplay.map((x) => html`<div class="inline-icon" instrument-type="${x}"></div>`)}`;
}

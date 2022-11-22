import { MoodColors } from '../../data/enumerations/mood.js';
import { html } from '../../exports.js';
import { PlayMusicDialog } from './play-music-dialog.js';

/**
 * @param { PlayMusicDialog } dialog
 */
export function renderPlayMusicDialog(dialog) {
    return html`
        <style>
            :host {
                background-color: ${MoodColors[dialog.currentTrack.mood] + 'aa'};
            }
        </style>
        <div id="player" @click="${() => dialog.toggle()}">
            <div id="close-button" @click="${() => dialog.close()}">&times;</div>
            <div id="play-button" ?paused="${dialog.audio.paused}"></div>
        </div>
        <div id="title">${dialog.currentTrack.displayName}</div>

        <range-slider
            id="position-slider"
            min="0"
            .value="${(dialog.audio.currentTime || 0).toString()}"
            .max="${Math.floor(dialog.audio.duration || 100).toString()}"
            steps="1000"
            @valueChanged="${(e) => dialog.changeTrackPosition(e.detail.value)}"
        ></range-slider>

        <fallback-audio
            id="current-track"
            .volume="${dialog.currentVolume}"
            .src="${dialog.currentTrackUrl || ''}"
            .fallbackSrc="${dialog.currentTrackUrl + '&highCompatibility=true'}"
            @loadedmetadata="${() => dialog.requestUpdate(undefined)}"
            @timeupdate="${() => dialog.requestUpdate(undefined)}"
        >
        </fallback-audio>
    `;
}

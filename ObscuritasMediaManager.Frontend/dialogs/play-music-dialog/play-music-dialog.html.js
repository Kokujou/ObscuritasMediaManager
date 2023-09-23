import { getMoodFontColor, MoodColors } from '../../data/enumerations/mood.js';
import { Session } from '../../data/session.js';
import { html } from '../../exports.js';
import { PlayMusicDialog } from './play-music-dialog.js';

/**
 * @param { PlayMusicDialog } dialog
 */
export function renderPlayMusicDialog(dialog) {
    return html`
        <style>
            :host {
                --primary-color: ${MoodColors[dialog.currentTrack.mood1] ?? '#ddd'};
                --secondary-color: ${MoodColors[dialog.currentTrack.mood2 ?? dialog.currentTrack.mood1] ?? '#ddd'};
                --font-color: ${getMoodFontColor(dialog.currentTrack.mood1)};
            }
        </style>
        <div id="player" @click="${() => dialog.toggle()}">
            <div id="close-button" @click="${() => dialog.close()}">&times;</div>
            <div id="play-button" ?paused="${Session.Audio.paused}"></div>
        </div>
        <div id="title">${dialog.currentTrack.displayName}</div>

        <range-slider
            id="position-slider"
            min="0"
            .value="${(Session.Audio.currentTime || 0).toString()}"
            .max="${Math.floor(Session.Audio.duration || 100).toString()}"
            steps="1000"
            @valueChanged="${(e) => dialog.changeTrackPosition(e.detail.value)}"
        ></range-slider>
    `;
}

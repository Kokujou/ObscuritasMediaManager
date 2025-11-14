import { html } from 'lit';
import { getMoodFontColor, MoodColors } from '../../data/enumerations/mood';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { AudioService } from '../../services/audio-service';
import { PlayMusicDialog } from './play-music-dialog';

export function renderPlayMusicDialog(this: PlayMusicDialog) {
    return html`
        <style>
            :host {
                --primary-color: ${MoodColors[this.currentTrack!.mood1] ?? '#ddd'};
                --secondary-color: ${MoodColors[this.currentTrack!.mood2 ?? this.currentTrack!.mood1] ?? '#ddd'};
                --font-color: ${getMoodFontColor(this.currentTrack!.mood1)};
            }
        </style>
        <div id="player" @click="${() => this.toggle()}">
            <div id="close-button" @click="${() => this.close()}">&times;</div>
            <div id="play-button" icon="${AudioService.paused ? Icons.Play : Icons.Pause}"></div>
        </div>
        <div id="title">${this.currentTrack?.displayName}</div>

        <range-slider
            id="position-slider"
            min="0"
            .value="${(AudioService.trackPosition || 0).toString()}"
            .max="${Math.floor(AudioService.duration || 100).toString()}"
            steps="1000"
            @valueChanged="${(e: CustomEvent<{ value: number }>) => this.changeTrackPosition(e.detail.value)}"
        ></range-slider>
    `;
}

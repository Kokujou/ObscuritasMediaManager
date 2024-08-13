import { html } from '../../exports.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { AudioService } from '../../services/audio-service.js';
import { CompactAudioPlayer } from './compact-audio-player.js';

/**
 * @param { CompactAudioPlayer } player
 */
export function renderCompactAudioPlayer(player) {
    return html`
        <div
            id="toggle-button"
            icon="${AudioService.currentTrackPath == player.track.path && !AudioService.paused ? Icons.Pause : Icons.Play}"
            class="button"
            @click="${() => player.toggleCurrentTrack()}"
        ></div>
        <div id="position-container">
            <range-slider
                id="track-position-input"
                @valueChanged="${(e) => player.changeTrackPosition(e.detail.value)}"
                .value="${player.currentTrackPosition.toString()}"
                min="0"
                .max="${player.currentTrackDuration.toString()}"
                steps="1000"
            ></range-slider>
        </div>
        <div id="volume-button-container">
            <div id="volume-button" icon="${Icons.ChangeVolume}" class="button"></div>
            <div id="volume-slider-container">
                <range-slider
                    id="volume-slider"
                    step="1"
                    min="0"
                    max="100"
                    .value="${`${AudioService.volume * 100}`}"
                    @valueChanged="${(e) => player.changeVolume(e.detail.value)}"
                ></range-slider>
            </div>
        </div>
    `;
}

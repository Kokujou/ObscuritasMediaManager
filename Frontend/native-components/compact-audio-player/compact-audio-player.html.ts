import { html } from 'lit';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { AudioService } from '../../services/audio-service';
import { CompactAudioPlayer } from './compact-audio-player';

export function renderCompactAudioPlayer(this: CompactAudioPlayer) {
    return html`
        <div
            id="toggle-button"
            icon="${AudioService.currentTrackPath == this.path && !AudioService.paused ? Icons.Pause : Icons.Play}"
            class="button"
            @click="${() => this.toggleCurrentTrack()}"
        ></div>
        <div id="position-container">
            <range-slider
                id="track-position-input"
                @valueChanged="${(e: CustomEvent<{ value: string }>) => this.changeTrackPosition(e.detail.value)}"
                .value="${this.currentTrackPosition.toString()}"
                min="0"
                .max="${this.currentTrackDuration.toString()}"
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
                    @valueChanged="${(e: CustomEvent<{ value: string }>) => this.changeVolume(Number.parseInt(e.detail.value))}"
                ></range-slider>
            </div>
        </div>
    `;
}

import { Instrumentation } from '../../data/enumerations/instrumentation.js';
import { Mood } from '../../data/enumerations/mood.js';
import { Participants } from '../../data/enumerations/participants.js';
import { html } from '../../exports.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { MusicPlaylistPage } from './music-playlist-page.js';

/**
 * @param {MusicPlaylistPage} playlist
 */
export function renderMusicPlaylist(playlist) {
    return html`
        <page-layout>
            <div id="music-player-container" class="${playlist.currentTrack.mood}">
                <div id="current-track-container">
                    <div id="mood-switcher">
                        <scroll-select
                            id="mood-container"
                            .options="${Object.values(Mood)}"
                            .value="${Mood[playlist.currentTrack.mood]}"
                            @valueChanged="${(e) => playlist.changeProperty('mood', e.detail.value)}"
                        >
                        </scroll-select>
                    </div>
                    <div id="audio-tile-container">
                        <div
                            id="audio-image"
                            @click="${() => playlist.toggleCurrentTrack()}"
                            class="${playlist.paused ? 'paused' : 'playing'}"
                        ></div>
                        <div id="language-icon-section">
                            <div id="lagnuage-icon" class="inline-icon ${playlist.currentTrack.language}"></div>
                            <div id="nation-icon" class="inline-icon ${playlist.currentTrack.nation}"></div>
                        </div>
                        <div
                            @click="${() =>
                                playlist.changeProperty('participants', Enum.nextValue(Participants, playlist.currentTrack.participants))}"
                            id="participant-count-button"
                            class="inline-icon ${playlist.currentTrack.participants}"
                        ></div>
                        <div
                            @click="${() =>
                                playlist.changeProperty(
                                    'instrumentation',
                                    Enum.nextValue(Instrumentation, playlist.currentTrack.instrumentation)
                                )}"
                            id="instrumentation-button"
                            class="inline-icon"
                        >
                            ${playlist.currentTrack.instrumentation}
                        </div>
                        <range-slider id="track-position"></range-slider>
                        <!-- <div id="language-switcher-overlay"></div> -->
                    </div>
                    <div id="audio-control-container">
                        <div id="audio-title">${playlist.currentTrack.name}</div>
                        <div id="audio-subtitle">
                            <div id="audio-author">${playlist.currentTrack.author}</div>
                            <div id="audio-source">${playlist.currentTrack.source}</div>
                        </div>
                        <div id="audio-controls">
                            <div id="previous-track-button" @click="${() => playlist.changeTrack(-1)}" class="audio-icon"></div>
                            <div
                                id="toggle-track-button"
                                @click="${() => playlist.toggleCurrentTrack()}"
                                class="audio-icon ${playlist.paused ? 'paused' : 'playing'}"
                            ></div>
                            <div id="next-track-button" @click="${() => playlist.changeTrack(1)}" class="audio-icon"></div>
                            <div class="audio-icon" id="random-order-button"></div>
                            <div class="audio-icon" id="reset-order-button"></div>
                            <div class="audio-icon" id="remove-track-button"></div>
                            <div id="change-volume-container">
                                <div id="lower-volume-button"></div>
                                <range-slider
                                    id="change-volume"
                                    @valueChanged="${(e) => playlist.changeVolume(e.detail.value)}"
                                    step="1"
                                    min="0"
                                    max="100"
                                    .value="${`${playlist.currentVolumne * 100}`}"
                                ></range-slider>
                                <div id="raise-volume-button"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="playlist-item-container"></div>
            </div>
            <audio preload="none" id="audio-player" .volume="${playlist.currentVolumne}" .src="${playlist.audioSource}"></audio>
        </page-layout>
    `;
}

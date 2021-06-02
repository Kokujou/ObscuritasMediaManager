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
            <div id="music-player-container" class="${playlist.updatedTrack.mood}">
                <div id="current-track-container">
                    <div id="mood-switcher">
                        <scroll-select
                            id="mood-container"
                            .options="${Object.values(Mood)}"
                            .value="${Mood[playlist.updatedTrack.mood]}"
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
                            <div id="lagnuage-icon" class="inline-icon ${playlist.updatedTrack.language}"></div>
                            <div id="nation-icon" class="inline-icon ${playlist.updatedTrack.nation}"></div>
                        </div>
                        <div
                            @click="${() =>
                                playlist.changeProperty('participants', Enum.nextValue(Participants, playlist.updatedTrack.participants))}"
                            id="participant-count-button"
                            class="inline-icon ${playlist.updatedTrack.participants}"
                        ></div>
                        <div
                            @click="${() =>
                                playlist.changeProperty(
                                    'instrumentation',
                                    Enum.nextValue(Instrumentation, playlist.updatedTrack.instrumentation)
                                )}"
                            id="instrumentation-button"
                            class="inline-icon"
                        >
                            ${playlist.updatedTrack.instrumentation}
                        </div>
                        <range-slider id="track-position"></range-slider>
                        <!-- <div id="language-switcher-overlay"></div> -->
                    </div>
                    <div id="audio-control-container">
                        <editable-label
                            id="audio-title"
                            .value="${playlist.updatedTrack.name}"
                            @valueChanged="${(e) => playlist.changeProperty('name', e.detail.value)}"
                        ></editable-label>
                        <div id="audio-subtitle">
                            <editable-label
                                id="audio-author"
                                .value="${playlist.updatedTrack.author}"
                                @valueChanged="${(e) => playlist.changeProperty('author', e.detail.value)}"
                            ></editable-label>
                            <div id="subtitle-separator">-</div>
                            <editable-label
                                id="audio-source"
                                .value="${playlist.updatedTrack.source || '---'}"
                                @valueChanged="${(e) => playlist.changeProperty('source', e.detail.value)}"
                            ></editable-label>
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
                <paginated-scrolling
                    scrollTopThreshold="20"
                    id="playlist-item-container"
                    @scrollBottom="${() => playlist.loadMoreTracks()}"
                >
                    ${playlist.paginatedPlaylistTracks.map((x) => html` <div class="playlist-entry">${x.displayName}</div> `)}
                </paginated-scrolling>
            </div>
            <audio preload="none" id="audio-player" .volume="${playlist.currentVolumne}" .src="${playlist.audioSource}"></audio>
        </page-layout>
    `;
}

import { Genre } from '../../data/enumerations/genre.js';
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
                            .value="${playlist.updatedTrack.mood}"
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
                            <div
                                id="lagnuage-icon"
                                class="inline-icon ${playlist.updatedTrack.language}"
                                @click="${() => playlist.showLanguageSwitcher()}"
                            ></div>
                            <div
                                id="nation-icon"
                                class="inline-icon ${playlist.updatedTrack.nation}"
                                @click="${() => playlist.showNationSwitcher()}"
                            ></div>
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

                        <div id="rating-container">
                            ${[1, 2, 3, 4, 5].map(
                                (rating) =>
                                    html` <div
                                        class="star ${rating <= playlist.updatedTrack.rating ? 'selected' : ''} ${rating <=
                                        playlist.hoveredRating
                                            ? 'hovered'
                                            : ''}"
                                        @pointerover="${() => (playlist.hoveredRating = rating)}"
                                        @pointerout="${() => (playlist.hoveredRating = 0)}"
                                        @click="${(e) => playlist.changeProperty('rating', rating)}"
                                    >
                                        ★
                                    </div>`
                            )}
                        </div>

                        <div id="instruments-container" @click="${() => playlist.openInstrumentsDialog()}">
                            ${playlist.updatedTrack.instrumentTypes?.length == 0
                                ? html`<a id="add-instruments-link">Add Instruments</a>`
                                : ''}
                            ${playlist.updatedTrack.instrumentTypes
                                .filter((instrument, index, self) => self.indexOf(instrument) == index)
                                .map((instrument) => html` <div class="instrument-icon ${instrument}"></div> `)}
                        </div>
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
                        <div id="genre-section">
                            ${playlist.updatedTrack.genres.map(
                                (genreKey) =>
                                    html`<tag-label
                                        .text="${Genre[genreKey]}"
                                        @removed="${() => playlist.removeGenreKey(genreKey)}"
                                    ></tag-label>`
                            )}
                            <tag-label
                                createNew
                                .autocomplete="${playlist.autocompleteGenres}"
                                @tagCreated="${(e) => playlist.addGenre(e.detail.value)}"
                            ></tag-label>
                        </div>
                        <div id="track-position-container">
                            <div id="track-position-label">${playlist.currentTrackPositionText}</div>
                            <range-slider
                                id="track-position"
                                @valueChanged="${(e) => playlist.changeTrackPosition(e.detail.value)}"
                                .value="${playlist.currentTrackPosition.toString()}"
                                min="0"
                                .max="${playlist.currentTrackDuration.toString()}"
                                steps="1000 "
                            ></range-slider>
                            <div id="track-position-label">${playlist.currentTrackDurationText}</div>
                        </div>
                        <div id="audio-controls">
                            <div id="previous-track-button" @click="${() => playlist.changeTrackBy(-1)}" class="audio-icon"></div>
                            <div
                                id="toggle-track-button"
                                @click="${() => playlist.toggleCurrentTrack()}"
                                class="audio-icon ${playlist.paused ? 'paused' : 'playing'}"
                            ></div>
                            <div id="next-track-button" @click="${() => playlist.changeTrackBy(1)}" class="audio-icon"></div>

                            <div id="change-volume-container">
                                <div id="change-volume-button" class="audio-icon"></div>
                                <range-slider
                                    id="change-volume"
                                    @valueChanged="${(e) => playlist.changeVolume(e.detail.value)}"
                                    step="1"
                                    min="0"
                                    max="100"
                                    .value="${`${playlist.currentVolumne * 100}`}"
                                ></range-slider>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="playlist-container">
                    <div id="playlist-options">
                        <div class="audio-icon" id="random-order-button"></div>
                        <div class="audio-icon" id="reset-order-button"></div>
                        <div class="audio-icon" id="remove-track-button"></div>
                    </div>
                    <paginated-scrolling
                        scrollTopThreshold="20"
                        id="playlist-item-container"
                        @scrollBottom="${() => playlist.loadMoreTracks()}"
                    >
                        ${playlist.paginatedPlaylistTracks.map(
                            (x, index) =>
                                html` <div class="playlist-entry" @dblclick="${() => playlist.changeTrack(index)}">${x.displayName}</div> `
                        )}
                    </paginated-scrolling>
                </div>
            </div>
            <audio
                controls
                preload="auto"
                @loadedmetadata="${() => playlist.requestUpdate(undefined)}"
                @ended="${() => playlist.changeTrackBy(1)}"
                @timeupdate="${() => playlist.requestUpdate(undefined)}"
                id="audio-player"
                .volume="${playlist.currentVolumne}"
                .src="${playlist.audioSource}"
            ></audio>
        </page-layout>
    `;
}

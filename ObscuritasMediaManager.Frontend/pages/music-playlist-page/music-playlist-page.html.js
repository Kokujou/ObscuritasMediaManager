import { ExtendedMusicModel } from '../../data/music.model.extended.js';
import { html } from '../../exports.js';
import { Instrumentation, Mood, MusicGenre, Participants } from '../../obscuritas-media-manager-backend-client.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { MusicPlaylistPage } from './music-playlist-page.js';

/**
 * @param {MusicPlaylistPage} playlist
 */
export function renderMusicPlaylist(playlist) {
    return html`
        <page-layout>
            <div id="music-player-container" class="${playlist.updatedTrack.mood}">
                <div id="complete-checkbox">
                    <div class="label">Complete:</div>
                    <input
                        type="checkbox"
                        id="complete-check"
                        .checked="${playlist.updatedTrack.complete}"
                        @input="${() => playlist.toggleComplete()}"
                    />
                </div>
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
                    <audio-tile-base
                        .track="${new ExtendedMusicModel(playlist.updatedTrack)}"
                        ?paused="${playlist.paused}"
                        @imageClicked="${() => playlist.toggleCurrentTrack()}"
                        @changeLanguage="${() => playlist.showLanguageSwitcher()}"
                        @changeNation="${() => playlist.showNationSwitcher()}"
                        @nextParticipants="${() =>
                            playlist.changeProperty(
                                'participants',
                                Enum.nextValue(Participants, playlist.updatedTrack.participants)
                            )}"
                        @nextInstrumentation="${() =>
                            playlist.changeProperty(
                                'instrumentation',
                                Enum.nextValue(Instrumentation, playlist.updatedTrack.instrumentation)
                            )}"
                        @changeRating="${(e) => playlist.changeProperty('rating', e.detail.rating)}"
                        @changeInstruemnts="${() => playlist.openInstrumentsDialog()}"
                    ></audio-tile-base>
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
                                        .text="${MusicGenre[genreKey]}"
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
                <media-playlist
                    .items="${playlist.playlist.map((x) => x.displayName)}"
                    .index="${playlist.currentTrackIndex}"
                    @indexChanged="${(e) => playlist.changeTrack(e.detail.index)}"
                    @randomize="${() => playlist.randomize()}"
                ></media-playlist>
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

import { getMoodFontColor, MoodColors } from '../../data/enumerations/mood.js';
import { Session } from '../../data/session.js';
import { html } from '../../exports.js';
import { Instrumentation, Mood, MusicGenre, MusicModel, Participants } from '../../obscuritas-media-manager-backend-client.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { MusicPlaylistPage } from './music-playlist-page.js';

/**
 * @param {MusicPlaylistPage} page
 */
export function renderMusicPlaylist(page) {
    var mood2 = page.updatedTrack.mood2 == Mood.Unset ? page.updatedTrack.mood1 : page.updatedTrack.mood2;
    return html`
        <style>
            :host {
                --primary-color: ${MoodColors[page.updatedTrack.mood1 ?? Mood.Unset]};
                --secondary-color: ${MoodColors[mood2 ?? Mood.Unset]};
                --font-color: ${getMoodFontColor(page.updatedTrack.mood1 ?? Mood.Unset)};
                --secondary-font-color: ${getMoodFontColor(mood2 ?? Mood.Unset)};
            }
        </style>
        ${page.moodToSwitch == 'mood1'
            ? html`
                  <style>
                      #mood-switcher {
                          background: linear-gradient(var(--primary-color) 0% 100%);
                          border: 2px solid var(--primary-color);
                      }
                  </style>
              `
            : page.moodToSwitch == 'mood2'
            ? html`<style>
                  #mood-switcher {
                      background: linear-gradient(#00000033 0% 100%), linear-gradient(var(--secondary-color) 0% 100%);
                      border: 2px solid var(--secondary-color);
                  }
              </style>`
            : ''};

        <page-layout>
            <div id="music-player-container">
                <div id="complete-checkbox">
                    <label for="complete-check" class="label">Complete:</label>
                    <input
                        type="checkbox"
                        id="complete-check"
                        ?checked="${page.updatedTrack.complete}"
                        oninput="this.dispatchEvent(new Event('change'))"
                        @change="${() => page.toggleComplete()}"
                    />
                </div>
                <div id="current-track-container">
                    <div id="mood-switcher-container" ?disabled="${page.updatedTrack.complete}">
                        <div id="mood-tabs">
                            <div id="first-mood" class="mood-tab" @click="${() => (page.moodToSwitch = 'mood1')}"></div>
                            <div id="second-mood" class="mood-tab" @click="${() => (page.moodToSwitch = 'mood2')}"></div>
                        </div>
                        <div id="mood-switcher" ?disabled="${page.updatedTrack.complete}">
                            <scroll-select
                                id="mood-container"
                                .options="${Object.values(Mood)}"
                                .value="${page.updatedTrack[page.moodToSwitch]}"
                                @valueChanged="${(e) => page.changeProperty(page.moodToSwitch, e.detail.value)}"
                            >
                            </scroll-select>
                        </div>
                    </div>

                    <div id="audio-tile-container">
                        <audio-tile-base
                            ?disabled="${page.updatedTrack.complete}"
                            .track="${new MusicModel(page.updatedTrack)}"
                            ?paused="${Session.Audio.paused}"
                            .visualizationData="${Session.Audio.visualizationData}"
                            @imageClicked="${() => page.toggleCurrentTrack()}"
                            @changeLanguage="${() => page.showLanguageSwitcher()}"
                            @nextParticipants="${() =>
                                page.changeProperty(
                                    'participants',
                                    Enum.nextValue(Participants, page.updatedTrack.participants)
                                )}"
                            @nextInstrumentation="${() =>
                                page.changeProperty(
                                    'instrumentation',
                                    Enum.nextValue(Instrumentation, page.updatedTrack.instrumentation)
                                )}"
                            @changeRating="${(e) => page.changeProperty('rating', e.detail.rating)}"
                            @changeInstruemnts="${() => page.openInstrumentsDialog()}"
                        ></audio-tile-base>
                        <div id="show-lyrics-link" @click="${() => page.showLyrics()}">Show Lyrics</div>
                    </div>
                    <div id="audio-control-container">
                        <input
                            type="text"
                            id="audio-title"
                            class="editable-label"
                            ?disabled="${page.updatedTrack.complete}"
                            .value=" ${page.updatedTrack.name}"
                            oninput="this.dispatchEvent(new Event('change')"
                            @change="${(e) => page.changeProperty('name', e.currentTarget.value)}"
                        />

                        <div id="audio-subtitle">
                            <input
                                type="text"
                                id="audio-author"
                                class="editable-label"
                                ?disabled="${page.updatedTrack.complete}"
                                .value="${page.updatedTrack.author}"
                                oninput="this.dispatchEvent(new Event('change')"
                                @change="${(e) => page.changeProperty('author', e.currentTarget.value)}"
                            />
                            <div id="subtitle-separator">-</div>
                            <input
                                type="text"
                                id="audio-source"
                                class="editable-label"
                                .value="${page.updatedTrack.source || '---'}"
                                ?disabled="${page.updatedTrack.complete}"
                                oninput="this.dispatchEvent(new Event('change')"
                                @change="${(e) => page.changeProperty('source', e.currentTarget.value)}"
                            />
                        </div>
                        <div id="genre-section">
                            ${page.updatedTrack.genres?.map(
                                (genreKey) =>
                                    html`<tag-label
                                        .text="${MusicGenre[genreKey]}"
                                        ?disabled="${page.updatedTrack.complete}"
                                        @removed="${() => page.removeGenreKey(genreKey)}"
                                    ></tag-label>`
                            )}
                            ${page.updatedTrack.complete
                                ? ''
                                : html` <tag-label
                                      createNew
                                      .autocomplete="${page.autocompleteGenres}"
                                      @tagCreated="${(e) => page.addGenre(e.detail.value)}"
                                  ></tag-label>`}
                        </div>
                        <div id="track-position-container">
                            <div id="track-position-label">${page.currentTrackPositionText}</div>
                            <range-slider
                                id="track-position"
                                @valueChanged="${(e) => page.changeTrackPosition(e.detail.value)}"
                                .value="${page.currentTrackPosition.toString()}"
                                min="0"
                                .max="${page.currentTrackDuration.toString()}"
                                steps="1000 "
                            ></range-slider>
                            <div id="track-position-label">${page.currentTrackDurationText}</div>
                        </div>
                        <div id="audio-controls">
                            <div id="previous-track-button" @click="${() => page.changeTrackBy(-1)}" class="audio-icon"></div>
                            <div
                                id="toggle-track-button"
                                @click="${() => page.toggleCurrentTrack()}"
                                class="audio-icon ${Session.Audio.paused ? 'paused' : 'playing'}"
                            ></div>
                            <div id="next-track-button" @click="${() => page.changeTrackBy(1)}" class="audio-icon"></div>

                            <div id="change-volume-container">
                                <div id="change-volume-button" class="audio-icon"></div>
                                <range-slider
                                    id="change-volume"
                                    @valueChanged="${(e) => page.changeVolume(e.detail.value)}"
                                    step="1"
                                    min="0"
                                    max="100"
                                    .value="${`${page.currentVolume * 100}`}"
                                ></range-slider>
                            </div>
                        </div>
                        <div id="change-path-container">
                            <input disabled id="path-input" .value="${'file:\\\\\\' + page.updatedTrack.path}" />
                            ${page.updatedTrack.complete
                                ? ''
                                : html`<div
                                      id="change-path-button"
                                      class="inline-icon"
                                      @click="${page.changeCurrentTrackPath}"
                                  ></div>`}
                        </div>
                    </div>
                </div>
                ${page.playlist.isTemporary
                    ? html`
                          <div id="edit-playlist-link" @click="${() => page.openEditPlaylistDialog()}">
                              <div id="edit-playlist-icon"></div>
                              <div id="edit-playlist-text">Zu Playlist befördern</div>
                          </div>
                      `
                    : html`
                          <div id="edit-playlist-link" @click="${() => page.openEditPlaylistDialog()}">
                              <div id="edit-playlist-icon"></div>
                              <div id="edit-playlist-text">Playlist bearbeiten</div>
                          </div>
                      `}
                <div id="media-playlist-container">
                    <media-playlist
                        .items="${page.playlist.tracks.map((x) => x.displayName)}"
                        .index="${page.currentTrackIndex}"
                        @indexChanged="${(e) => page.changeTrack(e.detail.index)}"
                        @randomize="${() => page.randomize()}"
                    ></media-playlist>
                </div>
            </div>
        </page-layout>
    `;
}

import { getMoodFontColor, MoodColors } from '../../data/enumerations/mood.js';
import { LitElementBase } from '../../data/lit-element-base.js';
import { html } from '../../exports.js';
import {
    Instrumentation,
    Mood,
    MusicGenre,
    MusicModel,
    Participants,
    PlaylistModel,
} from '../../obscuritas-media-manager-backend-client.js';
import { Icons } from '../../resources/inline-icons/icon-registry.js';
import { AudioService } from '../../services/audio-service.js';
import { ClipboardService } from '../../services/clipboard.service.js';
import { Enum } from '../../services/extensions/enum.extensions.js';
import { MusicPlaylistPage } from './music-playlist-page.js';

export class MusicPlaylistPageTemplate extends LitElementBase {
    /** @protected @type {PlaylistModel} */ playlist = new PlaylistModel({ tracks: [] });
    /** @protected @type {number} */ trackIndex = 0;
    /** @protected @type {MusicModel} */ currentTrack = new MusicModel();
    /** @protected @type {MusicModel} */ updatedTrack = new MusicModel();
    /** @protected @type {number} */ currentVolume = 0.1;
    /** @protected @type {number} */ maxPlaylistItems = 20;
    /** @protected @type {number} */ hoveredRating = 0;
    /** @protected @type {keyof MusicModel & ('mood1' | 'mood2')} */ moodToSwitch = 'mood1';
    /** @type {boolean} */ loop = false;

    /**
     * @this MusicPlaylistPage
     */
    render() {
        var mood2 = this.updatedTrack.mood2 == Mood.Unset ? this.updatedTrack.mood1 : this.updatedTrack.mood2;
        return html`
            <style>
                :host {
                    --primary-color: ${MoodColors[this.updatedTrack.mood1 ?? Mood.Unset]};
                    --secondary-color: ${MoodColors[mood2 ?? Mood.Unset]};
                    --font-color: ${getMoodFontColor(this.updatedTrack.mood1 ?? Mood.Unset)};
                    --secondary-font-color: ${getMoodFontColor(mood2 ?? Mood.Unset)};
                }
            </style>
            ${this.moodToSwitch == 'mood1'
                ? html`
                      <style>
                          #mood-switcher {
                              background: linear-gradient(var(--primary-color) 0% 100%);
                              border: 2px solid var(--primary-color);
                          }
                      </style>
                  `
                : this.moodToSwitch == 'mood2'
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
                            .checked="${this.updatedTrack.complete}"
                            @change="${() => this.toggleComplete()}"
                        />
                    </div>
                    <div id="current-track-container">
                        <div id="mood-switcher-container" ?disabled="${this.updatedTrack.complete}">
                            <div id="mood-tabs">
                                <div id="first-mood" class="mood-tab" @click="${() => (this.moodToSwitch = 'mood1')}"></div>
                                <div id="second-mood" class="mood-tab" @click="${() => (this.moodToSwitch = 'mood2')}"></div>
                            </div>
                            <div id="mood-switcher" ?disabled="${this.updatedTrack.complete}">
                                <scroll-select
                                    id="mood-container"
                                    .options="${Object.values(Mood)}"
                                    .value="${this.updatedTrack[this.moodToSwitch]}"
                                    @valueChanged="${(e) => this.changeProperty(this.moodToSwitch, e.detail.value)}"
                                >
                                </scroll-select>
                            </div>
                        </div>

                        <div id="audio-tile-container">
                            <audio-tile-base
                                ?disabled="${this.updatedTrack.complete}"
                                .track="${new MusicModel(this.updatedTrack)}"
                                ?paused="${AudioService.paused}"
                                .visualizationData="${AudioService.visualizationData.current()}"
                                @imageClicked="${() => this.toggleCurrentTrack()}"
                                @changeLanguage="${() => this.showLanguageSwitcher()}"
                                @nextParticipants="${() =>
                                    this.changeProperty(
                                        'participants',
                                        Enum.nextValue(Participants, this.updatedTrack.participants, 'Unset')
                                    )}"
                                @nextInstrumentation="${() =>
                                    this.changeProperty(
                                        'instrumentation',
                                        Enum.nextValue(Instrumentation, this.updatedTrack.instrumentation, 'Unset')
                                    )}"
                                @changeRating="${(e) => this.changeProperty('rating', e.detail)}"
                                @changeInstruemnts="${() => this.openInstrumentsDialog()}"
                            ></audio-tile-base>
                            <div id="show-lyrics-link" @click="${() => this.showLyrics()}">Show Lyrics</div>
                        </div>
                        <div id="audio-control-container">
                            <input
                                type="text"
                                id="audio-title"
                                class="editable-label"
                                tooltip="Name"
                                ?disabled="${this.updatedTrack.complete}"
                                .value="${this.updatedTrack.name}"
                                oninput="this.dispatchEvent(new Event('change'))"
                                @change="${(e) => this.changeProperty('name', e.currentTarget.value)}"
                            />

                            <div id="audio-subtitle">
                                <input
                                    type="text"
                                    id="audio-author"
                                    class="editable-label"
                                    ?disabled="${this.updatedTrack.complete}"
                                    .value="${this.updatedTrack.author}"
                                    oninput="this.dispatchEvent(new Event('change'))"
                                    tooltip="Autor"
                                    @change="${(e) => this.changeProperty('author', e.currentTarget.value)}"
                                />
                                <div id="subtitle-separator">-</div>
                                <input
                                    type="text"
                                    id="audio-source"
                                    class="editable-label"
                                    tooltip="Quelle"
                                    .value="${this.updatedTrack.source || '---'}"
                                    ?disabled="${this.updatedTrack.complete}"
                                    oninput="this.dispatchEvent(new Event('change'))"
                                    @change="${(e) => this.changeProperty('source', e.currentTarget.value)}"
                                />
                            </div>
                            <div id="genre-section">
                                ${this.updatedTrack.genres?.map(
                                    (genreKey) =>
                                        html`<tag-label
                                            .text="${MusicGenre[genreKey]}"
                                            ?disabled="${this.updatedTrack.complete}"
                                            @removed="${() => this.removeGenreKey(genreKey)}"
                                        ></tag-label>`
                                )}
                                ${this.updatedTrack.complete
                                    ? ''
                                    : html` <tag-label
                                          createNew
                                          .autocomplete="${this.autocompleteGenres}"
                                          @tagCreated="${(e) => this.addGenre(e.detail.value)}"
                                      ></tag-label>`}
                            </div>
                            <div id="track-position-container">
                                <div id="track-position-label">${this.currentTrackPositionText}</div>
                                <range-slider
                                    id="track-position"
                                    @valueChanged="${(e) => this.changeTrackPosition(e.detail.value)}"
                                    .value="${this.currentTrackPosition.toString()}"
                                    min="0"
                                    .max="${this.currentTrackDuration.toString()}"
                                    steps="1000"
                                ></range-slider>
                                <div id="track-position-label">${this.currentTrackDurationText}</div>
                            </div>
                            <div id="audio-controls">
                                <div
                                    id="copy-track-button"
                                    icon="${Icons.Clipboard}"
                                    class="audio-icon"
                                    tooltip="In Zwischenablage kopieren"
                                    @click="${() => ClipboardService.copyAudioToClipboard(this.currentTrack)}"
                                ></div>
                                <div
                                    id="previous-track-button"
                                    icon="${Icons.FastForward}"
                                    @click="${() => this.changeTrackBy(-1)}"
                                    class="audio-icon"
                                ></div>
                                <div
                                    id="toggle-track-button"
                                    @click="${() => this.toggleCurrentTrack()}"
                                    icon="${AudioService.paused ? Icons.Play : Icons.Pause}"
                                    class="audio-icon"
                                ></div>
                                <div
                                    id="next-track-button"
                                    icon="${Icons.FastForward}"
                                    @click="${() => this.changeTrackBy(1)}"
                                    class="audio-icon"
                                ></div>

                                <div id="change-volume-container">
                                    <div id="change-volume-button" icon="${Icons.ChangeVolume}" class="audio-icon"></div>
                                    <range-slider
                                        id="change-volume"
                                        @valueChanged="${(e) => this.changeVolume(e.detail.value)}"
                                        step="1"
                                        min="0"
                                        max="100"
                                        .value="${`${AudioService.volume * 100}`}"
                                    ></range-slider>
                                </div>
                            </div>
                            <div id="change-path-container">
                                <input disabled id="path-input" .value="${'file:\\\\\\' + this.updatedTrack.path}" />
                                ${this.updatedTrack.complete
                                    ? ''
                                    : html`<div
                                          id="change-path-button"
                                          class="inline-icon"
                                          icon="${Icons.Edit}"
                                          @click="${this.changeCurrentTrackPath}"
                                      ></div>`}
                            </div>
                        </div>
                    </div>
                    ${this.createNew
                        ? html` <div id="edit-playlist-link" @click="${() => this.createTrack()}">
                              <div id="create-track-icon" icon="${Icons.SaveTick}"></div>
                              <div id="edit-playlist-text">Track erstellen</div>
                          </div>`
                        : this.playlist.isTemporary
                        ? html`
                              <div id="edit-playlist-link" @click="${() => this.openEditPlaylistDialog()}">
                                  <div id="edit-playlist-icon" icon="${Icons.Edit}"></div>
                                  <div id="edit-playlist-text">Zu Playlist befördern</div>
                              </div>
                          `
                        : html`
                              <div id="edit-playlist-link" @click="${() => this.openEditPlaylistDialog()}">
                                  <div id="edit-playlist-icon" icon="${Icons.SaveTick}"></div>
                                  <div id="edit-playlist-text">Playlist bearbeiten</div>
                              </div>
                          `}
                    <div id="media-playlist-container">
                        <media-playlist
                            .items="${this.playlist.tracks.map((x) => x.displayName)}"
                            .index="${this.trackIndex}"
                            @indexChanged="${(e) => this.changeTrack(e.detail.index)}"
                            @randomize="${() => this.randomize()}"
                        ></media-playlist>
                    </div>
                </div>
            </page-layout>
        `;
    }
}

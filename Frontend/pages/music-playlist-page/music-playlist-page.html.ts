import { html } from 'lit';
import { getMoodFontColor, MoodColors } from '../../data/enumerations/mood';
import { Session } from '../../data/session';
import { Enum } from '../../extensions/enum.extensions';
import { LinkElement } from '../../native-components/link-element/link-element';
import { Instrumentation, Mood, MusicGenre, MusicModel, Participants } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { AudioService } from '../../services/audio-service';
import { ClipboardService } from '../../services/clipboard.service';
import { MediaDetailPage } from '../media-detail-page/media-detail-page';
import { MusicPlaylistPage } from './music-playlist-page';

export function renderMusicPlaylistPage(this: MusicPlaylistPage) {
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
                            <div id="first-mood" class="mood-tab" @click="${() => this.switchSelectedMood('mood1')}"></div>
                            <div id="second-mood" class="mood-tab" @click="${() => this.switchSelectedMood('mood2')}"></div>
                        </div>
                        <div id="mood-switcher" ?disabled="${this.updatedTrack.complete}">
                            <scroll-select
                                id="mood-container"
                                .options="${Object.values(Mood)}"
                                .value="${this.updatedTrack[this.moodToSwitch]}"
                                @valueChanged="${(e: CustomEvent<{ value: Mood }>) =>
                                    this.changeProperty(this.moodToSwitch, e.detail.value)}"
                            >
                            </scroll-select>
                        </div>
                    </div>

                    <div id="audio-tile-container">
                        <audio-tile-base
                            ?disabled="${this.updatedTrack.complete}"
                            .track="${new MusicModel(this.updatedTrack)}"
                            ?paused="${AudioService.paused || AudioService.currentTrackPath != this.updatedTrack.path}"
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
                            @changeRating="${(e: CustomEvent) => this.changeProperty('rating', e.detail)}"
                            @changeInstruemnts="${() => this.openInstrumentsDialog()}"
                        ></audio-tile-base>
                        <div id="show-lyrics-link" @click="${() => this.showLyrics()}">Show Lyrics</div>
                    </div>
                    <div id="audio-control-container">
                        ${this.updatedTrack.complete
                            ? html`<div id="audio-title">${this.updatedTrack.name}</div>`
                            : html`
                                  <input
                                      type="text"
                                      id="audio-title"
                                      class="editable-label"
                                      tooltip="Name"
                                      ?disabled="${this.updatedTrack.complete}"
                                      .value="${this.updatedTrack.name}"
                                      oninput="this.dispatchEvent(new Event('change'))"
                                      @change="${(e: Event) =>
                                          this.changeProperty('name', (e.currentTarget as HTMLInputElement).value)}"
                                  />
                              `}

                        <div id="audio-subtitle">
                            <input
                                type="text"
                                id="audio-author"
                                class="editable-label"
                                ?disabled="${this.updatedTrack.complete}"
                                .value="${this.updatedTrack.author ?? ''}"
                                oninput="this.dispatchEvent(new Event('change'))"
                                tooltip="Autor"
                                @change="${(e: Event) =>
                                    this.changeProperty('author', (e.currentTarget as HTMLInputElement).value)}"
                            />
                            <div id="subtitle-separator">-</div>
                            ${this.updatedTrack?.complete && this.sourceMediaId
                                ? LinkElement.forPage(
                                      MediaDetailPage,
                                      { mediaId: this.sourceMediaId },
                                      this.updatedTrack.source!,
                                      { target: '_blank', className: 'media-link' }
                                  )
                                : renderSourceInput.call(this)}
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
                                      @tagCreated="${(e: CustomEvent) => this.addGenre(e.detail.value)}"
                                  ></tag-label>`}
                        </div>
                        <div id="track-position-container">
                            <div id="track-position-label">${this.currentTrackPositionText}</div>
                            <range-slider
                                id="track-position"
                                @valueChanged="${(e: CustomEvent) => this.changeTrackPosition(e.detail.value)}"
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
                                @click="${() => ClipboardService.copyAudioToClipboard(this.updatedTrack)}"
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
                                    step="1"
                                    min="0"
                                    max="100"
                                    .value="${`${AudioService.volume * 100}`}"
                                    @valueChanged="${(e: CustomEvent) => this.changeVolume(e.detail.value)}"
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
                        @indexChanged="${(e: CustomEvent) => this.changeTrack(e.detail.index)}"
                        @randomize="${() => this.randomize()}"
                    ></media-playlist>
                </div>
            </div>
        </page-layout>
    `;
}

export function renderSourceInput(this: MusicPlaylistPage) {
    return html` <input
            type="text"
            id="audio-source"
            class="editable-label"
            tooltip="Quelle"
            .value="${this.updatedTrack.source || '---'}"
            ?disabled="${this.updatedTrack.complete}"
            ?hoverable="${this.sourceMediaId && this.updatedTrack.complete}"
            oninput="this.dispatchEvent(new Event('change'))"
            list="media-list"
            style="text-overflow: ellipsis"
            @change="${(e: Event) => this.changeProperty('source', (e.currentTarget as HTMLInputElement).value)}"
            @click="${(e: Event) => e.preventDefault()}"
        />
        <datalist id="media-list">
            ${Session.mediaList.current().map((x) => html`<option value="${x.name}"></option>`)}
        </datalist>`;
}

import { html } from 'lit';
import { MoodColors, getMoodFontColor } from '../../data/enumerations/mood';
import { changePage } from '../../extensions/url.extension';
import { Mood } from '../../obscuritas-media-manager-backend-client';
import { Icons } from '../../resources/inline-icons/icon-registry';
import { OfflineMusicPage } from '../offline-music-page/offline-music-page';
import { OfflineSession } from '../session';
import { OfflineMusicDetailsPage } from './offline-music-details-page';

export function renderOfflineMusicDetailsPage(this: OfflineMusicDetailsPage) {
    if (!OfflineSession.initialized) return;

    if (!this.currentTrack) {
        changePage(OfflineMusicPage);
        return;
    }

    var mood2 = this.currentTrack.mood2 == Mood.Unset ? this.currentTrack.mood1 : this.currentTrack.mood2;
    return html`
        <style>
            :host {
                --primary-color: ${MoodColors[this.currentTrack.mood1 ?? Mood.Unset]};
                --secondary-color: ${MoodColors[mood2 ?? Mood.Unset]};
                --font-color: ${getMoodFontColor(this.currentTrack.mood1 ?? Mood.Unset)};
                --secondary-font-color: ${getMoodFontColor(mood2 ?? Mood.Unset)};
            }
        </style>

        <flex-column id="player" @click="${(e: Event) => e.stopPropagation()}">
            <div id="back-button" @click="${() => changePage(OfflineMusicPage)}">←</div>

            <audio-tile-base
                .track="${this.currentTrack}"
                disabled
                .visualizationData="${OfflineSession.visualizationData}"
                ?paused="${OfflineSession.audio.paused}"
                @imageClicked="${(e: Event) => this.toggleTrack(e)}"
            >
            </audio-tile-base>

            <flex-column id="caption">
                <div id="title">${this.currentTrack.name}</div>
                <div id="sources">
                    ${this.currentTrack.author?.replace('undefined', '') || ''}
                    ${this.currentTrack.source ? `(${this.currentTrack.source.trim()})` : ''}
                </div>
            </flex-column>
            <flex-row id="controls">
                <flex-row class="control-section">
                    <div
                        id="shuffle"
                        class="audio-control"
                        icon="${Icons.ShufflePlaylist}"
                        @click="${(e: Event) => this.shufflePlaylist(e)}"
                    ></div>
                </flex-row>

                <flex-row class="control-section">
                    <div
                        id="last-track"
                        class="audio-control"
                        icon="${Icons.FastForward}"
                        @click="${(e: Event) => this.changeToTrackAt(this.index - 1, e)}"
                    ></div>
                    <div
                        id="toggle-track"
                        class="audio-control"
                        icon="${OfflineSession.audio.paused ? Icons.Play : Icons.Pause}"
                        @click="${this.toggleTrack}"
                    ></div>
                    <div
                        id="next-track"
                        class="audio-control"
                        icon="${Icons.FastForward}"
                        @click="${(e: Event) => this.changeToTrackAt(this.index + 1, e)}"
                    ></div>
                </flex-row>
                <flex-row class="control-section">
                    <range-slider
                        @valueChanged="${(e: CustomEvent<{ value: string }>) =>
                            OfflineSession.changeVolume(Number.parseInt(e.detail.value) / 100)}"
                        id="volume"
                        step="1"
                        min="0"
                        max="100"
                        .value="${`${OfflineSession.audio.volume * 100}`}"
                    >
                    </range-slider>
                </flex-row>
            </flex-row>
            <flex-row id="time">
                <div id="track-position-label">${this.currentTrackPositionText}</div>

                <range-slider
                    id="track-position"
                    @valueChanged="${(e: CustomEvent) => (OfflineSession.audio.currentTime = e.detail.value)}"
                    .value="${this.currentTrackPosition.toString()}"
                    min="0"
                    .max="${this.currentTrackDuration.toString()}"
                    steps="1000"
                ></range-slider>
                <div id="track-position-label">${this.currentTrackDurationText}</div>
            </flex-row>

            ${this.playlistId
                ? html`
                      <flex-column id="playlist" ?expanded="${this.playlistExpanded}">
                          <flex-row id="next-track-row" @click="${() => (this.playlistExpanded = !this.playlistExpanded)}">
                              <div id="playlist-icon" class="audio-control" icon="${Icons.PlaylistIcon}"></div>
                              <flex-row id="next-track-text" center>
                                  <b>Nächster Track:</b>
                                  <div id="next-track-name-wrapper">
                                      <div id="next-track-name">${this.nextTrack?.displayName ?? '---'}</div>
                                  </div>
                              </flex-row>
                          </flex-row>
                          <flex-column id="playlist-items" expanded>
                              ${this.currentPlaylist!.map((hash, index) => {
                                  const track = OfflineSession.musicMetadata.find((x) => x.hash == hash);
                                  return html`<flex-row
                                      class="playlist-entry"
                                      ?active="${this.currentTrack?.hash == hash}"
                                      @click="${(e: Event) => this.changeToTrackAt(index, e)}"
                                  >
                                      <div class="track-icon" icon="${Icons.Note}"></div>
                                      <flex-column class="playlist-entry-text">
                                          <div class="playlist-entry-name">${track?.name!}</div>
                                          <div class="playlist-entry-source">
                                              ${track?.author?.replace('undefined', '') || ''}
                                              ${track?.source ? `(${track.source.trim()})` : ''}
                                          </div>
                                      </flex-column>
                                  </flex-row>`;
                              })}
                          </flex-column>
                      </flex-column>
                  `
                : html`<div></div>`}
        </flex-column>
    `;
}

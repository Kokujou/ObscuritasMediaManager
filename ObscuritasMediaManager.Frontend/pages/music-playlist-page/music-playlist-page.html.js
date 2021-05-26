import { Mood } from '../../data/enumerations/mood.js';
import { html } from '../../exports.js';
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
                        <div id="mood-container">
                            <div class="fade-space"></div>
                            ${Object.values(Mood).map(
                                (x) => html`<a @click="${() => playlist.changeMood(x)}" class="change-mood-button">${x}</a>`
                            )}
                            <div class="fade-space"></div>
                        </div>
                    </div>
                    <div id="audio-tile-container">
                        <div id="main-image"></div>
                        <div id="language-icon-section">
                            <div id="lagnuage-icon" class="inline-icon ${playlist.currentTrack.language}"></div>
                            <div id="nation-icon" class="inline-icon ${playlist.currentTrack.nation}"></div>
                        </div>
                        <div id="participant-count-button" class="inline-icon ${playlist.currentTrack.participants}"></div>
                        <div id="instrumentation-button" class="inline-icon">${playlist.currentTrack.instrumentation}</div>
                        <div id="language-switcher-overlay"></div>
                    </div>
                    <div id="audio-control-container">
                        <div id="audio-title">${playlist.currentTrack.name}</div>
                        <div id="audio-subtitle">
                            <div id="audio-author">${playlist.currentTrack.author}</div>
                            <div id="audio-source">${playlist.currentTrack.source}</div>
                        </div>
                        <div id="audio-controls">
                            <div id="previous-track-button"></div>
                            <div id="toggle-track-button"></div>
                            <div id="next-track-button"></div>
                        </div>
                    </div>
                </div>
                <div id="playlist-container">
                    <div id="playlist-item-container">
                        ${playlist.playlist.map((x) => html`<div id="playlist-entry">${x.displayName}</div>`)}
                    </div>
                    <div id="playlist-option-container">
                        <input type="range" id="track-position" />
                    </div>
                    <div id="random-order-button"></div>
                    <div id="reset-order-button"></div>
                    <div id="remove-track-button"></div>
                </div>
            </div>
            <audio id="audio-player" .src="/ObscuritasMediaManager/api/file/audio?audioPath=${playlist.currentTrack.src}"></audio>
        </page-layout>
    `;
}

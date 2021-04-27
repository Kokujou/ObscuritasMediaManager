import { html } from '../../exports.js';
import { VideoPlayerPopup } from './video-player-popup.js';

/**
 * @param {VideoPlayerPopup} videoPlayer
 */
export function renderVideoPlayer(videoPlayer) {
    return html` <video id="video" .src="${videoPlayer.src}" controls></video> `;
}

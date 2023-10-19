import { InteropCommand } from '../client-interop/interop-command.js';
import { InteropMessage } from '../client-interop/interop-message.js';
import { Observable } from '../data/observable.js';

export class ClientInteropService {
    /** @type {WebSocket} */ static socket;

    /**
     * @param {InteropMessage} message
     */
    static sendMessage(message) {
        return new Promise((resolve) => {
            this.socket.send(JSON.stringify(message));
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    }

    /**
     * @typedef {Object} AudioTrack
     * @prop {number} duration
     * @prop {Observable<number>} position
     */

    static startConnection() {
        return new Promise((resolve) => {
            this.socket = new WebSocket('ws://localhost:8005/Interop');
            this.socket.onopen = () => {
                resolve();
            };
        });
    }

    static async copyAudioToClipboard(filePath) {}

    /**
     * @param {string[]} supportedFileTypes
     * @returns {Promise<string[]>}
     */
    static async requestFiles(supportedFileTypes) {}

    /**
     * @returns {Promise<string>}
     */
    static async requestFolder() {}

    /**
     * @param {string} trackPath
     * @returns {Promise<Observable<AudioTrack>>}
     */
    static async loadTrack(trackPath) {
        this.sendMessage({ command: InteropCommand.LoadTrack });
    }

    static async resumeTrack() {}

    static async pauseTrack() {}

    /**
     * @param {number} position
     */
    static async changeTrackPosition(position) {}
}

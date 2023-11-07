import { InteropCommand } from '../client-interop/interop-command.js';
import { InteropEvent } from '../client-interop/interop-event.js';
import { InteropQuery } from '../client-interop/interop-query.js';
import { TrackChangedEventResponse } from '../client-interop/track-changed-event-response.js';
import { Observable, Subscription } from '../data/observable.js';
import { MusicModel } from '../obscuritas-media-manager-backend-client.js';
import { ClientInteropService } from './client-interop-service.js';

export class AudioService {
    static currentTrackPath = '';
    static paused = true;

    static #volume = 0;
    static get volume() {
        return this.#volume;
    }

    static visualizationData = new Observable(new Float32Array());
    static trackPosition = new Observable(0);
    static duration = 0;
    /** @type {Observable} */ static ended = new Observable(null);
    /** @type {Observable} */ static changed = new Observable(null);

    /** @type {Subscription} */ static #eventSubscription = ClientInteropService.eventResponse.subscribe((x) => {
        this.paused = false;
        if (x?.event == InteropEvent.TrackChanged) {
            this.paused = false;
            var response = /** @type {TrackChangedEventResponse} */ (x.payload);
            this.currentTrackPath = response.trackPath;
            this.trackPosition.next(response.trackPosition);
            this.visualizationData.next(new Float32Array(response.visualizationData));
            this.changed.next();
        } else if (x?.event == InteropEvent.TrackEnded) {
            this.reset();
            this.ended.next();
        }
    });

    /** @type {Subscription} */ static #commandSubscription = ClientInteropService.commandResponse.subscribe((x) => {
        switch (x?.command) {
            case InteropCommand.ResumeTrack:
                this.paused = false;
                break;
            case InteropCommand.PauseTrack:
                this.paused = true;
                break;
            case InteropCommand.StopTrack:
                this.paused = true;
                this.trackPosition.next(0);
                this.visualizationData.next(new Float32Array());
                break;
            case InteropCommand.ChangeTrackPosition:
                break;
            case InteropCommand.ChangeTrackVolume:
                this.#volume = /** @type {number} */ (x.request);
                break;
            default:
                return;
        }
        this.changed.next();
    });
    /** @type {Subscription} */ static #querySubscription = ClientInteropService.queryResponse.subscribe((x) => {
        switch (x?.query) {
            case InteropQuery.LoadTrack:
                this.duration = /** @type {number} */ (x.result);
                this.currentTrackPath = /** @type {string} */ (x.request);
                this.paused = true;
                break;
            default:
                return;
        }
        this.changed.next();
    });

    static async reinitialize() {
        try {
            await ClientInteropService.executeQuery({ query: InteropQuery.LoadTrack, payload: this.currentTrackPath });
            await ClientInteropService.sendCommand({
                command: InteropCommand.ChangeTrackPosition,
                payload: this.trackPosition.current(),
            });
        } catch (err) {
            console.error('reinitializing track failed:', err);
        }
    }

    /**
     * @param {MusicModel} track
     */
    static async changeTrack(track) {
        if (!track?.path) return;

        try {
            await ClientInteropService.executeQuery({ query: InteropQuery.LoadTrack, payload: track.path });
            await this.changeVolume(this.volume);
        } catch (err) {
            console.error('initializing track failed:', err);
        }
    }

    static async play() {
        try {
            await ClientInteropService.sendCommand({ command: InteropCommand.ResumeTrack, payload: null });
        } catch (err) {
            console.error('playing audio failed, trying to reinitialize:', err);
            await this.reinitialize();
        }
    }

    static async pause() {
        try {
            await ClientInteropService.sendCommand({ command: InteropCommand.PauseTrack, payload: null });
        } catch (err) {
            console.error('pausing audio failed:', err);
        }
    }

    static async reset() {
        try {
            await ClientInteropService.sendCommand({ command: InteropCommand.StopTrack, payload: null });
        } catch (err) {
            console.error('resetting audio failed:', err);
        }
    }

    /**
     * @param {number} value
     */
    static async changeVolume(value) {
        try {
            await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackVolume, payload: value });
        } catch (err) {
            console.error('changing volume failed:', err);
        }
    }

    /**
     * @param {number} value
     */
    static async changePosition(value) {
        try {
            await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackPosition, payload: value });
        } catch (err) {
            console.error('changing track position failed:', err);
        }
    }
}

ClientInteropService.onConnected.subscribe(async () => {
    var localStorageVolume = localStorage.getItem('volume');
    await AudioService.changeVolume(Number.parseInt(localStorageVolume) / 100);
});

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

    /** @type {Subscription} */ static #eventSubscription = ClientInteropService.eventResponse.subscribe((x) => {
        this.paused = false;
        if (x?.event == InteropEvent.TrackChanged) {
            this.paused = false;
            var response = /** @type {TrackChangedEventResponse} */ (x.payload);
            this.currentTrackPath = response.trackPath;
            this.trackPosition.next(response.trackPosition);
            this.visualizationData.next(new Float32Array(response.visualizationData));
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
                break;
        }
    });
    /** @type {Subscription} */ static #querySubscription = ClientInteropService.queryResponse.subscribe((x) => {
        switch (x?.query) {
            case InteropQuery.LoadTrack:
                this.duration = /** @type {number} */ (x.result);
                this.currentTrackPath = /** @type {string} */ (x.request);
                this.paused = true;
                break;
            default:
                break;
        }
    });

    /**
     * @param {MusicModel} track
     */
    static async changeTrack(track) {
        if (!track?.path) return;
        await ClientInteropService.executeQuery({ query: InteropQuery.LoadTrack, payload: track.path });
        await this.changeVolume(this.volume);
    }

    static async play() {
        await ClientInteropService.sendCommand({ command: InteropCommand.ResumeTrack, payload: null });
    }

    static async pause() {
        await ClientInteropService.sendCommand({ command: InteropCommand.PauseTrack, payload: null });
    }

    static async reset() {
        await ClientInteropService.sendCommand({ command: InteropCommand.StopTrack, payload: null });
    }

    /**
     * @param {number} value
     */
    static async changeVolume(value) {
        await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackVolume, payload: value });
    }

    /**
     * @param {number} value
     */
    static async changePosition(value) {
        await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackPosition, payload: value });
    }
}

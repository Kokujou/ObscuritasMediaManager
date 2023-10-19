import { InteropCommand } from '../client-interop/interop-command.js';
import { InteropEvent } from '../client-interop/interop-event.js';
import { InteropQuery } from '../client-interop/interop-query.js';
import { Observable, Subscription } from '../data/observable.js';
import { MusicModel } from '../obscuritas-media-manager-backend-client.js';
import { ClientInteropService } from './client-interop-service.js';

export class AudioService {
    static paused = true;

    static #volume = 0;
    static get volume() {
        return this.#volume;
    }

    static visualizationData = new Observable(new Float32Array());
    static trackPosition = new Observable(0);
    static duration = 0;

    /** @type {Subscription} */ static #eventSubscription;

    /**
     * @param {MusicModel} track
     */
    static async changeTrack(track) {
        await ClientInteropService.executeQuery({ query: InteropQuery.LoadTrack, payload: track.path });
        await this.play();
        await this.changeVolume(this.volume);
    }

    static async play() {
        console.log('play');
        await ClientInteropService.sendCommand({ command: InteropCommand.ResumeTrack, payload: null });
        this.paused = false;
        if (this.#eventSubscription) return;

        this.#eventSubscription = ClientInteropService.eventResponse.subscribe((x) => {
            if (x?.event == InteropEvent.TrackPositionChanged) this.trackPosition.next(x.payload);
            if (x?.event == InteropEvent.VisualizationDataChanged) this.visualizationData.next(x.payload);
        });
    }

    static async pause() {
        console.trace();
        await ClientInteropService.sendCommand({ command: InteropCommand.PauseTrack, payload: null });
        this.paused = true;
        this.#eventSubscription?.unsubscribe();
        this.#eventSubscription = null;
    }

    static async reset() {
        await ClientInteropService.sendCommand({ command: InteropCommand.StopTrack, payload: null });
        this.paused = true;
    }

    /**
     * @param {number} value
     */
    static async changeVolume(value) {
        await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackVolume, payload: value });
        this.#volume = value;
    }

    /**
     * @param {number} value
     */
    static async changePosition(value) {
        await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackPosition, payload: value });
    }
}

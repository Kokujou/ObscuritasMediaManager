import { ConnectedEvent } from '../client-interop/connected-event';
import { InteropCommand } from '../client-interop/interop-command';
import { InteropEvent } from '../client-interop/interop-event';
import { InteropQuery } from '../client-interop/interop-query';
import { PlaybackState } from '../client-interop/playback-state';
import { PlaybackStateChangedEvent } from '../client-interop/playback-state-changed-event';
import { TrackChangedEvent } from '../client-interop/track-changed-event';
import { TrackPositionChangedEvent } from '../client-interop/track-position-changed-event';
import { VolumeChangedEvent } from '../client-interop/volume-changed-event';
import { Observable } from '../data/observable';
import { ClientInteropService } from './client-interop-service';

export class AudioService {
    static currentTrackPath = '';
    static paused = true;

    static #volume = 0;
    static get volume() {
        return this.#volume;
    }

    static visualizationData = new Observable(new Float32Array());
    static trackPosition = new Observable(0);
    static duration: number | null = null;
    static ended = new Observable<void>(null!);
    static changed = new Observable<void>(null!);

    static #eventSubscription = ClientInteropService.eventResponse.subscribe((x) => {
        switch (x?.event) {
            case InteropEvent.TrackPositionChanged: {
                let response = x as TrackPositionChangedEvent;
                this.paused = false;
                this.trackPosition.next(response.trackPosition);
                this.visualizationData.next(new Float32Array(response.visualizationData));

                this.changed.next();
                break;
            }
            case InteropEvent.TrackEnded: {
                this.reset();

                this.ended.next();
                break;
            }
            case InteropEvent.Connected: {
                let response = x as ConnectedEvent;
                this.trackPosition.next(response.position);
                this.visualizationData.next(new Float32Array(response.visualizationData));
                this.paused = response.playbackState != PlaybackState.Playing;
                this.duration = response.duration;
                this.#volume = response.volume;
                this.currentTrackPath = response.trackPath;

                this.changed.next();
                break;
            }
            case InteropEvent.TrackChanged: {
                let response = x as TrackChangedEvent;
                this.currentTrackPath = response.trackPath;
                this.duration = response.duration;

                this.changed.next();
                break;
            }
            case InteropEvent.PlaybackStateChanged: {
                let response = x as PlaybackStateChangedEvent;
                this.paused = response.playbackState != PlaybackState.Playing;

                this.changed.next();
                break;
            }
            case InteropEvent.VolumeChanged: {
                let response = x as VolumeChangedEvent;
                this.#volume = response.volume;

                this.changed.next();
                break;
            }
        }
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

    static async changeTrack(path: string) {
        if (!path) return;

        try {
            await ClientInteropService.executeQuery({ query: InteropQuery.LoadTrack, payload: path });
            if (this.volume) await this.changeVolume(this.volume);
        } catch (err) {
            console.error('initializing track failed:', err);
        }
    }

    static async play(trackPath: string) {
        try {
            if (AudioService.currentTrackPath != trackPath) await this.changeTrack(trackPath);
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

    static async changeVolume(value: number) {
        try {
            if (!value) console.trace();
            await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackVolume, payload: value });
        } catch (err) {
            console.error('changing volume failed:', err);
        }
    }

    static async changePosition(value: number) {
        try {
            await ClientInteropService.sendCommand({ command: InteropCommand.ChangeTrackPosition, payload: value });
        } catch (err) {
            console.error('changing track position failed:', err);
        }
    }
}

ClientInteropService.onConnected.subscribe(async () => {
    var localStorageVolume = localStorage.getItem('volume') ?? '0';
    await AudioService.changeVolume(Number.parseInt(localStorageVolume) / 100);
});

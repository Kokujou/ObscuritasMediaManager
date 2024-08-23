/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { IInteropEvent } from "./i-interop-event";
import { PlaybackState } from "./playback-state";
import { InteropEvent } from "./interop-event";

export class ConnectedEvent implements IInteropEvent {
    playbackState: PlaybackState;
    trackPath: string;
    duration: number;
    position: number;
    volume: number;
    visualizationData: number[];
    event: InteropEvent;
}

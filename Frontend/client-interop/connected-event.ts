/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import { InteropEventBase } from "./interop-event-base";
import { PlaybackState } from "./playback-state";

export class ConnectedEvent extends InteropEventBase {
    playbackState: PlaybackState;
    trackPath: string;
    duration: number;
    position: number;
    volume: number;
    visualizationData: number[];
}

﻿using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsEnum]
public enum InteropEvent
{
    TrackChanged,
    TrackEnded,
    Connected
}
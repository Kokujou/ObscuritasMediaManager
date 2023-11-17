using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsClass]
public class ConnectedEventResponse
{
    public string? TrackPath { get; set; }
    public PlaybackState PlaybackState { get; set; }
}

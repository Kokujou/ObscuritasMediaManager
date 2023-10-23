using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsClass]
class TrackChangedEventResponse
{
    public required string TrackPath { get; set; }
    public required float[] VisualizationData { get; set; }
    public required long TrackPosition { get; set; }
}

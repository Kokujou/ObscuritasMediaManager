using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Responses;

[ExportTsClass]
public class TrackUpdatedEventResponse
{
    public required float[] VisualizationData { get; set; }
    public required int TrackPosition { get; set; }
}

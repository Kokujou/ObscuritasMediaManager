using System;
using System.Linq;
using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

[ExportTsEnum]
public enum InteropEvent
{
    TrackPositionChanged,
    VisualizationDataChanged,
}

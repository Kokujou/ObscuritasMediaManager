using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class TrackPositionChangedEvent(double trackPosition, float[] visualizationData)
    : InteropEventBase(InteropEvent.TrackPositionChanged)
{
    public double TrackPosition => trackPosition;
    public float[] VisualizationData => visualizationData;
}
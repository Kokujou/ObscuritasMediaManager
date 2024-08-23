using TypeGen.Core.TypeAnnotations;

namespace ObscuritasMediaManager.ClientInterop.Events;

[ExportTsClass]
public class TrackPositionChangedEvent(double trackPosition, float[] visualizationData) : IInteropEvent
{
    public double TrackPosition => trackPosition;
    public float[] VisualizationData => visualizationData;
    public InteropEvent Event => InteropEvent.TrackPositionChanged;
}
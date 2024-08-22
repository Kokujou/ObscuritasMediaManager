using ObscuritasMediaManager.ClientInterop.Responses;

namespace ObscuritasMediaManager.ClientInterop.Events;

public class TrackUpdatedEvent : IInteropEvent<TrackUpdatedEventResponse>
{
    public InteropEvent Event => InteropEvent.TrackChanged;

    public TrackUpdatedEventResponse Invoke()
    {
        return new()
        {
            TrackPosition = (int)AudioService.GetCurrentTrackPosition().TotalMilliseconds,
            VisualizationData = AudioService.VisualizationData
        };
    }
}
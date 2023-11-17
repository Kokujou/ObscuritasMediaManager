using ObscuritasMediaManager.ClientInterop.Responses;
using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

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

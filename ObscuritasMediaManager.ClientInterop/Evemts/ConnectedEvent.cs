using ObscuritasMediaManager.ClientInterop.Responses;
using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

class ConnectedEvent : IInteropEvent<ConnectedEventResponse>
{
    public InteropEvent Event => InteropEvent.Connected;

    public ConnectedEventResponse Invoke()
    {
        return new()
               {
                   PlaybackState = AudioService.player.PlaybackState,
                   TrackPath = AudioService.TrackPath,
                   Duration = AudioService.GetCurrentTrackDuration().TotalMilliseconds
               };
    }
}

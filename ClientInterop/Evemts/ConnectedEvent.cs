using ObscuritasMediaManager.ClientInterop.Responses;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

internal class ConnectedEvent : IInteropEvent<ConnectedEventResponse>
{
    public InteropEvent Event => InteropEvent.Connected;

    public ConnectedEventResponse Invoke()
    {
        return new()
        {
            PlaybackState = AudioService.Player.PlaybackState,
            TrackPath = AudioService.TrackPath,
            Duration = AudioService.GetCurrentTrackDuration().TotalMilliseconds
        };
    }
}
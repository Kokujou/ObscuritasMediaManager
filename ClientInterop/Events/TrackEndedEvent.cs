namespace ObscuritasMediaManager.ClientInterop.Events;

public class TrackEndedEvent : IInteropEvent<object>
{
    public InteropEvent Event => InteropEvent.TrackEnded;

    public object? Invoke()
    {
        return null;
    }
}
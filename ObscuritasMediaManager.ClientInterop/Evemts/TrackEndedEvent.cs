using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

public class TrackEndedEvent : IInteropEvent<object>
{
    public InteropEvent Event => InteropEvent.TrackEnded;

    public object? Invoke()
    {
        return null;
    }
}

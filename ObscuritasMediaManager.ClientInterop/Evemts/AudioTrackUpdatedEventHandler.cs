using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

public static class AudioTrackUpdatedEventHandler
{
    public static bool Started = false;

    static AudioTrackUpdatedEventHandler()
    {
        _ = Task.Run(
            async () =>
            {
                while (true)
                {
                    await Task.Delay(50);

                    if (!Started)
                        continue;

                    foreach (var client in WebSocketInterop.Clients.Values.ToList())
                        client.InvokeEvent(new TrackUpdatedEvent());
                }
            });
    }

    public static void StartReporting()
    {
        Started = true;
        AudioService.player.PlaybackStopped += (_, _) =>
        {
            if (AudioService.GetCurrentTrackDuration() <= AudioService.GetCurrentTrackPosition())
                foreach (var client in WebSocketInterop.Clients.Values.ToList())
                    client.InvokeEvent(new TrackEndedEvent());
            AudioService.Stop();
        };
    }

    public static void StopReporting()
    {
        Started = false;
    }
}
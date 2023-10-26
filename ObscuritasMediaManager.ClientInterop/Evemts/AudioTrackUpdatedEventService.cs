using ObscuritasMediaManager.ClientInterop.Responses;
using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Evemts;

public static class AudioTrackUpdatedEventService
{
    public static bool Started = false;

    static AudioTrackUpdatedEventService()
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
                        client.InvokeEvent(
                            new()
                            {
                                Event = InteropEvent.TrackChanged,
                                Payload =
                                    new TrackChangedEventResponse
                                    {
                                        TrackPath = AudioService.TrackPath,
                                        TrackPosition = (long)AudioService.GetCurrentTrackPosition().TotalMilliseconds,
                                        VisualizationData = AudioService.VisualizationData
                                    }
                            });
                }
            });
    }

    public static void StartReporting()
    {
        Started = true;
        AudioService.player.PlaybackStopped += (_, _) =>
        {
            AudioService.Stop();
            foreach (var client in WebSocketInterop.Clients.Values.ToList())
                client.InvokeEvent(new() { Event = InteropEvent.TrackEnded, Payload = null });
        };
    }

    public static void StopReporting()
    {
        Started = false;
    }
}
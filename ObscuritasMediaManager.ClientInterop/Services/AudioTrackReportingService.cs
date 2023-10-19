using ObscuritasMediaManager.ClientInterop.Evemts;
using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Services;

public static class AudioTrackReportingService
{
    public static bool Started = false;

    public static void StartReporting()
    {
        Started = true;
        _ = Task.Run(
            async () =>
            {
                while (Started)
                {
                    await Task.Yield();

                    WebSocketInterop.Instance?.InvokeEvent(
                    new() { Event = InteropEvent.VisualizationDataChanged, Payload = AudioService.VisualizationData });

                    WebSocketInterop.Instance?.InvokeEvent(
                    new()
                    {
                        Event = InteropEvent.TrackPositionChanged,
                        Payload = AudioService.GetCurrentTrackPosition().Milliseconds
                    });
                }
            });
    }

    public static void StopReporting()
    {
        Started = false;
    }
}
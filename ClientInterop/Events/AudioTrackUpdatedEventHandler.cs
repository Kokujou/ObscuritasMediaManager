namespace ObscuritasMediaManager.ClientInterop.Events;

public static class AudioTrackUpdatedEventHandler
{
    public static bool Started;

    public static void StartReporting()
    {
        Started = true;
        AudioService.Player.PlaybackStopped += (_, args) =>
        {
            if (AudioService.GetCurrentTrackDuration() - TimeSpan.FromSeconds(5) <=
                AudioService.GetCurrentTrackPosition())
                foreach (var client in WebSocketInterop.Clients.Values.ToList())
                    client.InvokeEvent(new TrackEndedEvent());

            AudioService.Stop();
        };
    }

    public static void StopReporting()
    {
        Started = false;
    }

    static AudioTrackUpdatedEventHandler()
    {
        _ = Task.Run(
            async () =>
            {
                while (true)
                {
                    await Task.Delay(50);

                    if (!Started) continue;

                    foreach (var client in WebSocketInterop.Clients.Values.ToList())
                        client.InvokeEvent(new TrackUpdatedEvent());
                }
            });
    }
}
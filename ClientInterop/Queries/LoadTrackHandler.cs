namespace ObscuritasMediaManager.ClientInterop.Queries;

public class LoadTrackHandler : IQueryHandler
{
    public InteropQuery Query => InteropQuery.LoadTrack;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        var json = payload!;
        var filePath = json?.GetString()!;
        AudioService.ChangeTrack(filePath);

        return AudioService.GetCurrentTrackDuration().TotalMilliseconds;
    }
}
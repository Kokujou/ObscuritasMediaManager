namespace ObscuritasMediaManager.ClientInterop.Queries;

public class LoadTrackHandler : IQueryHandler
{
    public InteropQuery Query => InteropQuery.LoadTrack;

    public async Task<object?> ExecuteAsync(JsonElement? payload)
    {
        await Task.Yield();
        var filePath = payload?.GetString()!;
        await AudioService.ChangeTrackAsync(filePath);

        return AudioService.GetCurrentTrackDuration().TotalMilliseconds;
    }
}
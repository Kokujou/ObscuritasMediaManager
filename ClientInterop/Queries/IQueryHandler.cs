namespace ObscuritasMediaManager.ClientInterop.Queries;

internal interface IQueryHandler
{
    InteropQuery Query { get; }
    Task<object?> ExecuteAsync(JsonElement? payload);
}
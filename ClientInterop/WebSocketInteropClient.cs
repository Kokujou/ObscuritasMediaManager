using ObscuritasMediaManager.ClientInterop.Events;
using ObscuritasMediaManager.ClientInterop.Responses;
using System.Text.Json.Serialization;
using WebSocketSharp;

namespace ObscuritasMediaManager.ClientInterop;

public class WebSocketInteropClient : WebSocketBehavior
{
    public static readonly JsonSerializerOptions DefaultJsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        Converters = { new JsonStringEnumConverter() }
    };

    public Guid Id { get; set; }

    public void SendEvent<T>(T response) where T : IInteropEvent
    {
        var serialized = JsonSerializer.Serialize(response, DefaultJsonOptions);
        Send(serialized);
    }

    protected override void OnOpen()
    {
        base.OnOpen();
        Id = WebSocketInteropServer.AddClient(this);
    }

    protected override async void OnMessage(MessageEventArgs e)
    {
        base.OnMessage(e);
        var json = JsonDocument.Parse(e.Data);

        if (json.RootElement.EnumerateObject()
            .Any(x => x.Name.ToLower() == nameof(InteropCommandRequest.Command).ToLower()))
            await WebSocketInteropServer.HandleCommandForAsync(Id,
                JsonSerializer.Deserialize<InteropCommandRequest>(e.Data, DefaultJsonOptions)!);
        else
            await WebSocketInteropServer.HandleQueryForAsync(Id,
                JsonSerializer.Deserialize<InteropQueryRequest>(e.Data, DefaultJsonOptions)!);
    }

    protected override async void OnClose(CloseEventArgs e)
    {
        base.OnClose(e);
        await WebSocketInteropServer.RemoveClientAsync(Id);
    }

    public void RespondOnCommand(InteropCommandRequest request, ResponseStatus status, string? message = null)
    {
        var response = new InteropCommandResponse
        {
            Command = request.Command,
            Status = status,
            Ticks = request.Ticks,
            Message = message
        };

        var serialized = JsonSerializer.Serialize(response, DefaultJsonOptions);
        Send(serialized);
    }

    public void RespondOnQuery(InteropQueryRequest request, object? result, ResponseStatus status,
        string? message = null)
    {
        var response = new InteropQueryResponse
        {
            Query = request.Query,
            Status = status,
            Ticks = request.Ticks,
            Message = message,
            Result = result,
            Request = request.Payload
        };

        var serialized = JsonSerializer.Serialize(response, DefaultJsonOptions);
        Send(serialized);
    }
}
using ObscuritasMediaManager.ClientInterop.Commands;
using ObscuritasMediaManager.ClientInterop.Queries;
using ObscuritasMediaManager.ClientInterop.Responses;
using System;
using System.Linq;
using System.Reflection;
using WebSocketSharp;

namespace ObscuritasMediaManager.ClientInterop;

public class WebSocketInterop : WebSocketBehavior
{
    public static Dictionary<Guid, WebSocketInterop> Clients { get; private set; } = new();
    public static JsonSerializerOptions DefaultJsonOptions = new()
                                                             {
                                                                 PropertyNameCaseInsensitive = true,
                                                                 PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                                                             };
    private static Dictionary<InteropCommand, ICommandHandler> CommandHandlers { get; set; }
    private static Dictionary<InteropQuery, IQueryHandler> QueryHandlers { get; set; }

    static WebSocketInterop()
    {
        var exportedTyles = Assembly.GetExecutingAssembly().GetExportedTypes();

        CommandHandlers = exportedTyles
            .Where(x => typeof(ICommandHandler).IsAssignableFrom(x))
            .Select(Activator.CreateInstance)
            .ToDictionary(x => ((ICommandHandler)x!).Command, x => (ICommandHandler)x!);

        QueryHandlers = exportedTyles
            .Where(x => typeof(IQueryHandler).IsAssignableFrom(x))
            .Select(Activator.CreateInstance)
            .ToDictionary(x => ((IQueryHandler)x!).Query, x => (IQueryHandler)x!);
    }

    public Guid Id { get; set; }

    public void InvokeEvent(InteropEventResponse response)
    {
        var serialized = JsonSerializer.Serialize(response, DefaultJsonOptions);
        Send(serialized);
    }

    protected override void OnOpen()
    {
        base.OnOpen();
        Id = Guid.NewGuid();
        Clients.Add(Id, this);
    }

    protected override async void OnMessage(MessageEventArgs e)
    {
        base.OnMessage(e);
        var json = JsonDocument.Parse(e.Data);

        if (json.RootElement.EnumerateObject().Any(x => x.Name.ToLower() == nameof(InteropCommandRequest.Command).ToLower()))
            await HandleInteropCommand(e.Data);
        else
            await HandleInteropQuery(e.Data);
    }

    protected override async void OnClose(CloseEventArgs e)
    {
        base.OnClose(e);
        Clients.Remove(Id);
        if (Clients.Any()) return;
        await CommandHandlers[InteropCommand.StopTrack].ExecuteAsync(null);
    }

    private async Task HandleInteropCommand(string serialized)
    {
        var deserialized = JsonSerializer.Deserialize<InteropCommandRequest>(serialized, DefaultJsonOptions)!;
        var commandHandler = CommandHandlers[deserialized.Command];
        try
        {
            await commandHandler.ExecuteAsync(deserialized.Payload);
            RespondOnCommand(deserialized, ResponseStatus.Success);
        }
        catch (Exception ex)
        {
            RespondOnCommand(deserialized, ResponseStatus.Error, ex.ToString());
        }
    }

    private void RespondOnCommand(InteropCommandRequest request, ResponseStatus status, string? message = null)
    {
        var response = new InteropCommandResponse
                       {
                           Command = request.Command,
                           Status = status,
                           Ticks = request.Ticks,
                           Message = message,
                           Request = request.Payload
                       };

        var serialized = JsonSerializer.Serialize(response, DefaultJsonOptions);
        Send(serialized);
    }

    private async Task HandleInteropQuery(string serialized)
    {
        var deserialized = JsonSerializer.Deserialize<InteropQueryRequest>(serialized, DefaultJsonOptions)!;
        var queryHandler = QueryHandlers[deserialized.Query];
        try
        {
            var result = await queryHandler.ExecuteAsync(deserialized.Payload);
            RespondOnQuery(deserialized, result, ResponseStatus.Success);
        }
        catch (Exception ex)
        {
            RespondOnQuery(deserialized, null, ResponseStatus.Error, ex.Message);
        }
    }

    private void RespondOnQuery(InteropQueryRequest request, object? result, ResponseStatus status, string? message = null)
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
 
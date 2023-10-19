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
    public static WebSocketInterop? Instance { get; private set; }
    private static Dictionary<InteropCommand, ICommandHandler> CommandHandlers { get; set; }
    private static Dictionary<InteropQuery, IQueryHandler> QueryHandlers { get; set; }
    private static JsonSerializerOptions defaultJsonOptions = new()
                                                              {
                                                                  PropertyNameCaseInsensitive = true,
                                                                  PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                                                              };

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

    public WebSocketInterop()
    {
        Instance = this;
    }

    public void InvokeEvent(InteropEventResponse response)
    {
        var serialized = JsonSerializer.Serialize(response, defaultJsonOptions);
        Send(serialized);
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

    private async Task HandleInteropCommand(string serialized)
    {
        var deserialized = JsonSerializer.Deserialize<InteropCommandRequest>(serialized, defaultJsonOptions)!;
        var commandHandler = CommandHandlers[deserialized.Command];
        await commandHandler.ExecuteAsync(deserialized.Payload);
        RespondOnCommand(deserialized, ResponseStatus.Success);
    }

    private void RespondOnCommand(InteropCommandRequest request, ResponseStatus status, string? message = null)
    {
        var response = new InteropCommandResponse
                       {
                           Command = request.Command,
                           Status = status,
                           Ticks = request.Ticks,
                           Message = message
                       };

        var serialized = JsonSerializer.Serialize(response, defaultJsonOptions);
        Send(serialized);
    }

    private async Task HandleInteropQuery(string serialized)
    {
        var deserialized = JsonSerializer.Deserialize<InteropQueryRequest>(serialized, defaultJsonOptions)!;
        var queryHandler = QueryHandlers[deserialized.Query];
        var result = await queryHandler.ExecuteAsync(deserialized.Payload);
        RespondOnQuery(deserialized, result, ResponseStatus.Success);
    }

    private void RespondOnQuery(InteropQueryRequest request, object result, ResponseStatus status, string? message = null)
    {
        var response = new InteropQueryResponse
                       {
                           Query = request.Query,
                           Status = status,
                           Ticks = request.Ticks,
                           Message = message,
                           Result = result
                       };

        var serialized = JsonSerializer.Serialize(response, defaultJsonOptions);
        Send(serialized);
    }
}
 
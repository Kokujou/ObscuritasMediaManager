using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class RequestFilesHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.RequestFiles;

    public async Task ExecuteAsync(object? payload) { }
}

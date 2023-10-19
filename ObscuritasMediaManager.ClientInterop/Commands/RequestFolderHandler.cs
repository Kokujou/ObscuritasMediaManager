using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class RequestFolderHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.RequestFolder;

    public async Task ExecuteAsync(object? payload) { }
}

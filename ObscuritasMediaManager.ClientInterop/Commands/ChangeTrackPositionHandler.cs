using System;
using System.Linq;

namespace ObscuritasMediaManager.ClientInterop.Commands;

public class ChangeTrackPositionHandler : ICommandHandler
{
    public InteropCommand Command => InteropCommand.ChangeTrackPosition;

    public async Task ExecuteAsync(object? payload) { }
}
